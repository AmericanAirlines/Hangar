/* eslint-disable max-lines */
import {
  Entity,
  ManyToMany,
  OneToOne,
  Ref,
  Collection,
  EntityDTO,
  LockMode,
  OneToMany,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { ConstructorValues } from '../types/ConstructorValues';
import { ExpoJudgingVote } from './ExpoJudgingVote';
import { Project } from './Project';
import { Node } from './Node';
import { User } from './User';
import { JudgingSession } from './JudgingSession';
import { ExpoJudgingSession } from './ExpoJudgingSession';
import { getNextProject } from '../entitiesUtils';

export type JudgeDTO = EntityDTO<Judge>;

export type JudgeConstructorValues = ConstructorValues<
  Judge,
  'currentProject' | 'previousProject' | 'expoJudgingSessions' | 'expoJudgingVotes'
>;

type ReleaseAndContinueBaseArgs = {
  entityManager: EntityManager;
};
type VoteReleaseAndContinueArgs = ReleaseAndContinueBaseArgs & {
  action: 'vote';
  currentProjectChosen: boolean;
  expoJudgingSession: ExpoJudgingSession;
};
type SkipOrContinueArgs = ReleaseAndContinueBaseArgs & {
  action: 'continue' | 'skip';
};
type ReleaseAndContinueArgs = VoteReleaseAndContinueArgs | SkipOrContinueArgs;

export enum JudgeErrorCode {
  UnableToLockJudge = 'Judge was locked by another process; unable to proceed',
  CannotContinue = 'State of the Judge does not allow the continue action',
  CannotSkip = 'No current project to skip',
  MissingProjectForVote = 'Either current or past project was missing; cannot vote',
}

@Entity()
export class Judge extends Node<Judge> {
  constructor({ user }: JudgeConstructorValues) {
    super();

    this.user = user;
  }

  @OneToOne({ entity: () => User, ref: true, unique: true })
  user: Ref<User>;

  @OneToOne({ entity: () => Project, nullable: true, ref: true })
  currentProject?: Ref<Project>;

  @OneToOne({ entity: () => Project, nullable: true, ref: true })
  previousProject?: Ref<Project>;

  @ManyToMany({ entity: () => ExpoJudgingSession })
  expoJudgingSessions = new Collection<ExpoJudgingSession>(this);

  @OneToMany({ entity: () => ExpoJudgingVote, mappedBy: (ejv) => ejv.judge })
  expoJudgingVotes = new Collection<ExpoJudgingVote>(this);

  getNextProject = getNextProject;

  /**
   * Releases the current project for a team and decrements the relevant counters on the {@link Project `currentProject`},
   * assigns a new `currentProject`, and increments it's relevant counters
   *
   * This method consists of a transaction so all actions succeed or none do
   *
   * @throws an error with a {@link JudgingErrorCode} if criteria relevant to an action is not met
   *
   * @param args {@link ReleaseAndContinueBaseArgs}
   */
  private releaseProjectAndContinue(args: VoteReleaseAndContinueArgs): Promise<ExpoJudgingVote>;
  private releaseProjectAndContinue(args: SkipOrContinueArgs): Promise<undefined>;
  private async releaseProjectAndContinue(args: ReleaseAndContinueArgs) {
    const { entityManager } = args;
    let vote: ExpoJudgingVote | undefined;
    await entityManager.transactional(async (em) => {
      // Lock the judge so we can ensure this execution is the only thing modifying the judge
      const judge = await em.findOne(
        Judge,
        { id: this.id },
        {
          populate: ['expoJudgingVotes'],
          lockMode: LockMode.PESSIMISTIC_PARTIAL_WRITE, // Skip locked judges and handle below
        },
      );

      if (!judge) {
        throw new Error('Unable to lock Judge', { cause: JudgeErrorCode.UnableToLockJudge });
      }

      // PRE-REQUISITE CHECKING
      if (args.action === 'continue' && judge.previousProject) {
        // Judge has a previous project so they MUST vote instead of continuing
        throw new Error('Unable to continue when Judge has previous project', {
          cause: JudgeErrorCode.CannotContinue,
        });
      } else if (args.action === 'skip' && !judge.currentProject) {
        throw new Error('Unable to continue when Judge has previous project', {
          cause: JudgeErrorCode.CannotSkip,
        });
      } else if (args.action === 'vote') {
        // Action is a vote; create the new vote if relevant criteria is met
        if (!judge.currentProject || !judge.previousProject) {
          throw new Error(
            'Current Project or previous Project was not defined during vote operation',
            { cause: JudgeErrorCode.MissingProjectForVote },
          );
        }

        // VOTE CREATION
        vote = new ExpoJudgingVote({
          judge: judge.toReference(),
          previousProject: judge.previousProject,
          currentProject: judge.currentProject,
          currentProjectChosen: args.currentProjectChosen,
          judgingSession: args.expoJudgingSession.toReference(),
        });
        em.persist(vote);
      }

      // Update the previous project (as needed) and release current project
      if (judge.currentProject) {
        if (args.action !== 'skip') {
          // Only update the previous project when action is NOT skip
          judge.previousProject = judge.currentProject;
        }
        await judge.currentProject.getEntity().decrementActiveJudgeCount({ entityManager });
      }

      // Get a new project for the judge and assign it
      const nextProject = await judge.getNextProject({
        entityManager,
        excludedProjectIds: judge.expoJudgingVotes.getIdentifiers(),
      });

      if (nextProject) {
        judge.currentProject = nextProject.toReference();
        await nextProject.incrementActiveJudgeCount({ entityManager });
        await nextProject.incrementJudgeVisits({ entityManager });
      }

      em.persist(judge);
    });

    await entityManager.refresh(this);

    if (args.action === 'vote') {
      return vote as ExpoJudgingVote;
    }
    return undefined;
  }

  async continue({ entityManager }: { entityManager: EntityManager }): Promise<void> {
    await this.releaseProjectAndContinue({ entityManager, action: 'continue' });
  }

  async skip({ entityManager }: { entityManager: EntityManager }): Promise<void> {
    await this.releaseProjectAndContinue({ entityManager, action: 'skip' });
  }

  async vote({
    entityManager,
    currentProjectChosen,
    expoJudgingSession,
  }: {
    entityManager: EntityManager;
    currentProjectChosen: boolean;
    expoJudgingSession: JudgingSession;
  }): Promise<ExpoJudgingVote> {
    return this.releaseProjectAndContinue({
      entityManager,
      action: 'vote',
      currentProjectChosen,
      expoJudgingSession,
    });
  }
}

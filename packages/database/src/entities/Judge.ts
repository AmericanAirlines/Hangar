/* eslint-disable max-lines */
import {
  Entity,
  OneToOne,
  Ref,
  Collection,
  EntityDTO,
  LockMode,
  OneToMany,
  ManyToMany,
  ref,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { ConstructorValues } from '../types/ConstructorValues';
import { ExpoJudgingVote } from './ExpoJudgingVote';
import { Node } from './Node';
import { User } from './User';
import { JudgingSession } from './JudgingSession';
import { ExpoJudgingSession } from './ExpoJudgingSession';
import { ExpoJudgingSessionContext } from './ExpoJudgingSessionContext';
import { getNextProject } from '../entitiesUtils';
import { CriteriaJudgingSession } from './CriteriaJudgingSession';

export type JudgeDTO = EntityDTO<Judge>;

export type JudgeConstructorValues = ConstructorValues<
  Judge,
  'expoJudgingSessionContexts' | 'expoJudgingVotes' | 'criteriaJudgingSessions'
>;

type ReleaseProjectAndContinueBaseArgs = {
  entityManager: EntityManager;
  expoJudgingSession: ExpoJudgingSession;
};
type VoteAndReleaseProjectArgs = ReleaseProjectAndContinueBaseArgs & {
  action: 'vote';
  currentProjectChosen: boolean;
};
type SkipOrContinueAndReleaseProjectArgs = ReleaseProjectAndContinueBaseArgs & {
  action: 'continue' | 'skip';
};
type ReleaseAndContinueArgs = VoteAndReleaseProjectArgs | SkipOrContinueAndReleaseProjectArgs;

export enum JudgeErrorCode {
  UnableToLockJudge = 'Judge was locked by another process; unable to proceed',
  CannotContinue = 'State of the Judge does not allow the continue action',
  CannotSkip = 'No current project to skip',
  MissingProjectForVote = 'Either current or past project was missing; cannot vote',
}

type SkipOrContinueArgs = { entityManager: EntityManager; expoJudgingSession: ExpoJudgingSession };

@Entity()
export class Judge extends Node<Judge> {
  constructor({ user }: JudgeConstructorValues) {
    super();

    this.user = user;
  }

  @OneToOne({ entity: () => User, ref: true, unique: true })
  user: Ref<User>;

  @OneToMany({ entity: () => ExpoJudgingSessionContext, mappedBy: (ejsc) => ejsc.judge })
  expoJudgingSessionContexts = new Collection<ExpoJudgingSessionContext>(this);

  @OneToMany({ entity: () => ExpoJudgingVote, mappedBy: (ejv) => ejv.judge })
  expoJudgingVotes = new Collection<ExpoJudgingVote>(this);

  @ManyToMany({ entity: () => CriteriaJudgingSession })
  criteriaJudgingSessions = new Collection<CriteriaJudgingSession>(this);

  static getNextProject = getNextProject;

  /**
   * Releases the current project for a project and decrements the relevant counters on the {@link Project `currentProject`},
   * assigns a new `currentProject`, and increments it's relevant counters
   *
   * This method consists of a transaction so all actions succeed or none do
   *
   * @throws an error with a {@link JudgingErrorCode} if criteria relevant to an action is not met
   *
   * @param args {@link ReleaseProjectAndContinueBaseArgs}
   */
  private releaseProjectAndContinue(args: VoteAndReleaseProjectArgs): Promise<ExpoJudgingVote>;
  private releaseProjectAndContinue(args: SkipOrContinueAndReleaseProjectArgs): Promise<undefined>;
  private async releaseProjectAndContinue(args: ReleaseAndContinueArgs) {
    const { entityManager: rootEntityManager, expoJudgingSession } = args;
    let vote: ExpoJudgingVote | undefined;
    await rootEntityManager.transactional(async (em) => {
      // Lock the judge so we can ensure this execution is the only thing modifying the judge
      const context = await em.findOne(
        ExpoJudgingSessionContext,
        { judge: this.id, expoJudgingSession: expoJudgingSession.id },
        {
          lockMode: LockMode.PESSIMISTIC_PARTIAL_WRITE, // Skip locked judges and handle below
        },
      );

      if (!context) {
        throw new Error('Unable to lock Judge', { cause: JudgeErrorCode.UnableToLockJudge });
      }

      // PRE-REQUISITE CHECKING
      if (args.action === 'continue' && context.previousProject) {
        // Judge has a previous project so they MUST vote instead of continuing
        throw new Error('Unable to continue when Judge has previous project', {
          cause: JudgeErrorCode.CannotContinue,
        });
      } else if (args.action === 'skip' && !context.currentProject) {
        throw new Error('Unable to continue when Judge has previous project', {
          cause: JudgeErrorCode.CannotSkip,
        });
      } else if (args.action === 'vote') {
        // Action is a vote; create the new vote if relevant criteria is met
        if (!context.currentProject || !context.previousProject) {
          throw new Error(
            'Current Project or previous Project was not defined during vote operation',
            { cause: JudgeErrorCode.MissingProjectForVote },
          );
        }

        // VOTE CREATION
        vote = new ExpoJudgingVote({
          judge: ref(this),
          previousProject: context.previousProject,
          currentProject: context.currentProject,
          currentProjectChosen: args.currentProjectChosen,
          judgingSession: ref(args.expoJudgingSession),
        });
        em.persist(vote);
        // console.log([context.currentProject.id, context.previousProject.id]);
      }

      // Save a copy of the current project's ID to ignore it when looking for a new project
      const currentProjectId = context.currentProject?.id;

      // Update the previous project (as needed) and release current project
      if (context.currentProject) {
        if (args.action !== 'skip') {
          // Only update the previous project when action is NOT skip
          context.previousProject = context.currentProject;
        }
        await ref(context.currentProject).$.decrementActiveJudgeCount({ entityManager: em });
      }

      await this.expoJudgingVotes.load({ where: { judgingSession: expoJudgingSession.id } });
      const allExcludedProjectIds = this.expoJudgingVotes
        .getItems()
        .reduce(
          (allIds, { currentProject, previousProject }) => [
            ...allIds,
            currentProject.id,
            previousProject.id,
          ],
          [] as string[],
        );

      if (currentProjectId) {
        // If there's a current project, make sure to ignore that too
        allExcludedProjectIds.push(currentProjectId);
      }
      const uniqueExcludedProjectIds = Array.from(new Set(allExcludedProjectIds));

      // Get a new project for the judge and assign it
      const nextProject = await Judge.getNextProject({
        judge: this,
        entityManager: em,
        excludedProjectIds: uniqueExcludedProjectIds,
        expoJudgingSession,
      });

      if (nextProject) {
        context.currentProject = ref(nextProject);
        await nextProject.incrementActiveJudgeCount({ entityManager: em });
      } else {
        // No remaining projects left to assign
        context.currentProject = undefined;
      }

      em.persist(context);
    });

    await rootEntityManager.refresh(this);

    if (args.action === 'vote') {
      return vote as ExpoJudgingVote;
    }
    return undefined;
  }

  async continue({ entityManager, expoJudgingSession }: SkipOrContinueArgs): Promise<void> {
    await this.releaseProjectAndContinue({ entityManager, action: 'continue', expoJudgingSession });
  }

  async skip({ entityManager, expoJudgingSession }: SkipOrContinueArgs): Promise<void> {
    await this.releaseProjectAndContinue({ entityManager, action: 'skip', expoJudgingSession });
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

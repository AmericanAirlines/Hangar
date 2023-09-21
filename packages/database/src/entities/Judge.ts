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

type ReleaseAndContinueArgs =
  | {
      entityManager: EntityManager;
    } & (
      | { action: 'continue' | 'skip' }
      | { action: 'vote'; currentProjectChosen: boolean; expoJudgingSession: ExpoJudgingSession }
    );

export enum JudgeErrorCode {
  UnableToLockJudge, // Judge was locked by another process; unable to proceed
  CannotContinue, // State of the Judge does not allow the continue action
  MissingProjectForVote, // Either current or past project was missing; vote cannot
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
   * @param args {@link ReleaseAndContinueArgs}
   */
  private async releaseAndContinue(args: ReleaseAndContinueArgs) {
    const { entityManager } = args;
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

      if (args.action === 'continue' && judge.previousProject) {
        // Judge has a previous project so they MUST vote instead of continuing
        throw new Error('Unable to continue when Judge has previous project', {
          cause: JudgeErrorCode.CannotContinue,
        });
      } else if (args.action === 'vote') {
        // Action is a vote; create the new vote if relevant criteria is met
        if (!this.currentProject || !this.previousProject) {
          throw new Error(
            'Current Project or previous Project was not defined during vote operation',
            { cause: JudgeErrorCode.MissingProjectForVote },
          );
        }

        em.persist(
          new ExpoJudgingVote({
            judge: this.toReference(),
            previousProject: this.previousProject,
            currentProject: this.currentProject,
            currentProjectChosen: args.currentProjectChosen,
            judgingSession: args.expoJudgingSession.toReference(),
          }),
        );
      }

      // Update the previous project (as needed)
      if (this.currentProject) {
        this.previousProject = this.currentProject;
        await this.currentProject.getEntity().decrementActiveJudgeCount({ entityManager });
      }

      // Get a new project for the judge and assign it
      const nextProject = await this.getNextProject({
        entityManager,
        excludedProjectIds: this.expoJudgingVotes.getIdentifiers(),
      });

      if (nextProject) {
        this.currentProject = nextProject.toReference();
        await nextProject.incrementActiveJudgeCount({ entityManager });
        await nextProject.incrementJudgeVisits({ entityManager });
      }

      em.persist(this);
    });
  }

  async continue({ entityManager }: { entityManager: EntityManager }): Promise<void> {
    await this.releaseAndContinue({ entityManager, action: 'continue' });
  }

  async skip({ entityManager }: { entityManager: EntityManager }): Promise<void> {
    await this.releaseAndContinue({ entityManager, action: 'skip' });
  }

  async vote({
    entityManager,
    currentProjectChosen,
    expoJudgingSession,
  }: {
    entityManager: EntityManager;
    currentProjectChosen: boolean;
    expoJudgingSession: JudgingSession;
  }): Promise<void> {
    await this.releaseAndContinue({
      entityManager,
      action: 'vote',
      currentProjectChosen,
      expoJudgingSession,
    });
  }
}

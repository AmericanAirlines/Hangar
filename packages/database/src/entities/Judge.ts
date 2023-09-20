/* eslint-disable max-lines */
import {
  Entity,
  ManyToMany,
  OneToOne,
  Ref,
  Collection,
  EntityDTO,
  LockMode,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { ConstructorValues } from '../types/ConstructorValues';
import { ExpoJudgingVote } from './ExpoJudgingVote';
import { Project } from './Project';
import { Node } from './Node';
import { User } from './User';
import { JudgingSession } from './JudgingSession';
import { ExpoJudgingSession } from './ExpoJudgingSession';

export type JudgeDTO = EntityDTO<Judge>;

export type JudgeConstructorValues = ConstructorValues<
  Judge,
  'currentProject' | 'previousProject' | 'expoJudgingSessions'
>;

type ReleaseAndContinueArgs = {
  entityManager: EntityManager;
  action: 'continue' | 'skip';
};

export enum JudgeErrorCode {
  UnableToLockJudge,
  CannotContinue,
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

  private async releaseAndContinue({ entityManager, action }: ReleaseAndContinueArgs) {
    await entityManager.transactional(async (em) => {
      // Lock the judge so we can ensure this execution is the only thing modifying the judge
      const judge = await em.findOne(
        Judge,
        { id: this.id },
        { lockMode: LockMode.PESSIMISTIC_WRITE },
      );

      if (!judge) {
        throw new Error('Unable to lock Judge', { cause: JudgeErrorCode.UnableToLockJudge });
      }

      if (action === 'continue' && judge.previousProject) {
        throw new Error('Unable to continue when Judge has previous project', {
          cause: JudgeErrorCode.CannotContinue,
        });
      }
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
    judgingSession,
  }: {
    entityManager: EntityManager;
    currentProjectChosen: boolean;
    judgingSession: JudgingSession;
  }): Promise<void> {
    if (!this.currentProject || !this.previousProject) {
      throw new Error('Current Project or previous Project was not defined during vote operation');
    }
    // Create a new vote object with the outcome of the vote
    await entityManager.persistAndFlush(
      new ExpoJudgingVote({
        judge: this.toReference(),
        previousProject: this.previousProject,
        currentProject: this.currentProject,
        currentProjectChosen,
        judgingSession: judgingSession.toReference(),
      }),
    );
  }
}

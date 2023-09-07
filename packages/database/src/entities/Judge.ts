/* eslint-disable max-lines */
import { Entity, ManyToMany, OneToOne, Ref, Collection, EntityDTO } from '@mikro-orm/core';
import { EntityManager as em } from '@mikro-orm/postgresql';
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

  async getNextProject({
    entityManager,
    visitedProjectIds,
  }: {
    entityManager: em;
    visitedProjectIds: Ref<Project>[];
  }): Promise<Project | undefined> {
    const newProject = await Project.getNextAvailableProjectExcludingProjects({
      excludedProjectIds: visitedProjectIds,
      entityManager,
    });

    this.currentProject = newProject?.toReference(); // ? newProject.id : null;
    await entityManager.persistAndFlush(this);
    return newProject;
  }

  async continue({ entityManager }: { entityManager: em }): Promise<void> {
    await this.recordCurrentProjectAndSave({ entityManager, updatePrevious: true });
  }

  async skip({ entityManager }: { entityManager: em }): Promise<void> {
    const updatePrevious = false;
    await this.recordCurrentProjectAndSave({ entityManager, updatePrevious });
  }

  async vote({
    entityManager,
    currentProjectChosen,
    judgingSession,
  }: {
    entityManager: em;
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
    await this.recordCurrentProjectAndSave({ entityManager, updatePrevious: true });
  }

  async recordCurrentProjectAndSave({
    entityManager,
    updatePrevious = true,
  }: {
    entityManager: em;
    updatePrevious: boolean;
  }): Promise<void> {
    if (!this.currentProject) {
      throw new Error('Current Project was not defined during save operation');
    }

    if (updatePrevious) {
      this.previousProject = this.currentProject;
    }

    if (this.currentProject) {
      const currentProject = await entityManager.findOne(Project, { id: this.currentProject.id });

      if (currentProject) {
        await Project.decrementActiveJudgeCount({ project: currentProject, entityManager });
        await Project.incrementJudgeVisits({ project: currentProject, entityManager });
      }

      this.currentProject = undefined;
      await entityManager.persistAndFlush(this);
    }
  }
}

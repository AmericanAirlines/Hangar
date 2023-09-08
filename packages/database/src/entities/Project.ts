/* istanbul ignore file */
import { Entity, Property, OneToMany, Collection, QueryResult, EntityDTO } from '@mikro-orm/core';
import { EntityManager as em } from '@mikro-orm/postgresql';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';
import { User } from './User';
import {
  decrementActiveJudgeCount,
  incrementJudgeVisits,
  getNextAvailableProjectExcludingProjects,
} from '../entitiesUtils';

export type ProjectDTO = EntityDTO<Project>;

export type ProjectConstructorValues = ConstructorValues<
  Project,
  'contributors' | 'judgeVisits' | 'activeJudgeCount',
  'location'
>;

@Entity()
export class Project extends Node<Project> {
  @Property({ columnType: 'text' })
  name: string;

  @Property({ columnType: 'text', nullable: true })
  repoLink: string;

  @Property({ columnType: 'text' })
  description: string;

  @Property({ columnType: 'text', nullable: true, unique: true })
  location?: string;

  @OneToMany({ entity: () => User, mappedBy: (user) => user.project })
  contributors = new Collection<User>(this);

  @Property({ columnType: 'int', hidden: true })
  judgeVisits: number = 0;

  @Property({ columnType: 'int', hidden: true })
  activeJudgeCount: number = 0;

  constructor({ name, description, repoLink, ...extraValues }: ProjectConstructorValues) {
    super(extraValues);

    this.name = name;
    this.description = description;
    this.repoLink = repoLink;
  }

  static getNextAvailableProjectExcludingProjects = getNextAvailableProjectExcludingProjects;

  /* istanbul ignore next */
  static async updateSelectedProject({
    project,
    entityManager,
  }: {
    project: Project;
    entityManager: em;
  }): Promise<QueryResult<Project>> {
    return entityManager
      .createQueryBuilder(Project)
      .update({ activeJudgeCount: project.activeJudgeCount + 1 })
      .where({ id: project.id })
      .execute();
  }

  static decrementActiveJudgeCount = decrementActiveJudgeCount;

  static incrementJudgeVisits = incrementJudgeVisits;
}

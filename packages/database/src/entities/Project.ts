/* istanbul ignore file */
import { Entity, Property, OneToMany, Collection, QueryResult, EntityDTO } from '@mikro-orm/core';
import { EntityManager as em } from '@mikro-orm/postgresql';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';
import { User } from './User';
import { decrementActiveJudgeCount, incrementJudgeVisits } from '../entitiesUtils/judgeCount';

export type ProjectDTO = EntityDTO<Project>

export type ProjectConstructorValues = ConstructorValues<
  Project,
  'contributors' | 'judgeVisits' | 'activeJudgeCount',
  'location'
>;

@Entity()
export class Project extends Node<Project> {
  @Property({ columnType: 'text' })
  name: string;

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

  constructor({ name, description, ...extraValues }: ProjectConstructorValues) {
    super(extraValues);

    this.name = name;
    this.description = description;
  }

  static async getNextAvailableProjectExcludingProjects({
    excludedProjectIds = [],
    entityManager,
  }: {
    excludedProjectIds: string[];
    entityManager: em;
  }): Promise<Project | undefined> {
    let project: Project | null;
    let retries = 5;
    /* eslint-disable no-await-in-loop */
    const query: object = excludedProjectIds.length ? { id: { $nin: excludedProjectIds } } : {};
    const queryOptions = { orderBy: { activeJudgeCount: 'ASC', judgeVisits: 'ASC' } };
    do {
      project = await entityManager.findOne(Project, query, queryOptions);

      if (project) {
        const result = await Project.updateSelectedProject({ project, entityManager });
        project = await entityManager.findOne(Project, query, queryOptions);

        if (result.affectedRows > 0) {
          // We found a project and assigned the judge correctly; return it
          return project ?? undefined;
        }
      } else {
        // No projects remaining
        return undefined;
      }

      // We picked a project that we couldn't modify; wait briefly and then try again
      await new Promise((resolve) => {
        setTimeout(resolve, Math.random() * 500);
      });

      retries -= 1;
    } while (retries > 0);

    throw new Error('Unable to retrieve a project due to concurrency issues');
  }

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

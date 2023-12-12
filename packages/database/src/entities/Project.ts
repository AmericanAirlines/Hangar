/* istanbul ignore file */
import { Entity, Property, OneToMany, Collection, EntityDTO, raw } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { v4 } from 'uuid';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';
import { User } from './User';

export type ProjectDTO = EntityDTO<Project>;

export type ProjectConstructorValues = ConstructorValues<
  Project,
  'contributors' | 'activeJudgeCount' | 'inviteCode',
  'location'
>;

type ActiveJudgeCountModifierArgs = {
  entityManager: EntityManager;
};
type UpdateActiveJudgeCountArgs = ActiveJudgeCountModifierArgs & {
  action: 'increment' | 'decrement';
};

@Entity()
export class Project extends Node<Project> {
  @Property({ columnType: 'text', unique: true })
  inviteCode: string = v4();

  @Property({ columnType: 'text' })
  name: string;

  @Property({ columnType: 'text' })
  repoUrl: string;

  @Property({ columnType: 'text' })
  description: string;

  @Property({ columnType: 'text', nullable: true, unique: true })
  location?: string;

  @OneToMany({ entity: () => User, mappedBy: (user) => user.project })
  contributors = new Collection<User>(this);

  @Property({ columnType: 'int', hidden: true })
  activeJudgeCount: number = 0;

  constructor({ name, description, repoUrl, ...extraValues }: ProjectConstructorValues) {
    super(extraValues);

    this.name = name;
    this.description = description;
    this.repoUrl = repoUrl;
  }

  async incrementActiveJudgeCount({ entityManager }: ActiveJudgeCountModifierArgs) {
    await this.updateActiveJudgeCount({ entityManager, action: 'increment' });
  }

  async decrementActiveJudgeCount({ entityManager }: ActiveJudgeCountModifierArgs) {
    await this.updateActiveJudgeCount({ entityManager, action: 'decrement' });
  }

  private async updateActiveJudgeCount({ entityManager, action }: UpdateActiveJudgeCountArgs) {
    const qb = entityManager.createQueryBuilder(Project);
    const activeJudgeCountColumnName =
      entityManager.getMetadata(Project).properties.activeJudgeCount.name;
    await qb
      .update({
        activeJudgeCount: raw(
          `"${activeJudgeCountColumnName}" ${action === 'increment' ? '+' : '-'} 1`,
        ),
      })
      .where({ id: this.id })
      .execute();
  }
}

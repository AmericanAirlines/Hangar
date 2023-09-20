/* istanbul ignore file */
import { Entity, Property, OneToMany, Collection, EntityDTO } from '@mikro-orm/core';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';
import { User } from './User';

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

  @Property({ columnType: 'text' })
  repoUrl: string;

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

  constructor({ name, description, repoUrl, ...extraValues }: ProjectConstructorValues) {
    super(extraValues);

    this.name = name;
    this.description = description;
    this.repoUrl = repoUrl;
  }
}

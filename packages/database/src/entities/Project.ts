/* istanbul ignore file */
import { Entity, Ref, OneToOne, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';
import { User } from './User';

export type ProjectConstructorValues = ConstructorValues<Project>;
type ProjectPropertyKeys = keyof ProjectConstructorValues;

@Entity()
export class Project extends Node<Project> {
  @Property({ columnType: 'text' })
  name: string;

  @Property({ columnType: 'text' })
  description: string;

  @Property({ columnType: 'text', nullable: true, unique: true })
  location?: string;

  @OneToOne(() => User)
  user: Ref<User>;

  constructor({ name, description, user, ...extraValues }: ProjectConstructorValues) {
    super(extraValues);

    this.name = name;
    this.description = description;
    this.user = user;
  }
}

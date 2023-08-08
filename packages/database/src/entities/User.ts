/* istanbul ignore file */
import { Entity, Property, ManyToOne, Ref } from '@mikro-orm/core';
import { ConstructorValues } from '../types/ConstructorValues';
import { Project } from './Project';
import { Node } from './Node';

export type UserConstructorValues = ConstructorValues<User>;

@Entity()
export class User extends Node<User> {
  @Property({ columnType: 'text' })
  firstName: string;

  @Property({ columnType: 'text' })
  lastName: string;

  @ManyToOne({ entity: () => Project, nullable: true, ref: true })
  project?: Ref<Project>;

  @Property({ columnType: 'text', unique: true })
  email: string;

  constructor({ firstName, lastName, email }: UserConstructorValues) {
    super();

    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}

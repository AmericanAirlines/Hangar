/* istanbul ignore file */
import { Entity, Property, ManyToOne, Ref, EntityDTO } from '@mikro-orm/core';
import { ConstructorValues } from '../types/ConstructorValues';
import { Project } from './Project';
import { Node } from './Node';

export type UserDTO = EntityDTO<User>;

export type UserConstructorValues = ConstructorValues<User>;

@Entity()
export class User extends Node<User> {
  @Property({ columnType: 'text' })
  firstName: string;

  @Property({ columnType: 'text' })
  lastName: string;

  @Property({ columnType: 'text', unique: true })
  email: string;

  @ManyToOne({ entity: () => Project, nullable: true, ref: true })
  project?: Ref<Project>;

  constructor({ firstName, lastName, email }: UserConstructorValues) {
    super();

    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}

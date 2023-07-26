/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';

export type UserConstructorValues = ConstructorValues<User>;

@Entity()
export class User extends Node<User> {
  @Property({ columnType: 'text' })
  firstName: string;

  @Property({ columnType: 'text' })
  lastName: string;

  constructor({ firstName, lastName }: UserConstructorValues) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

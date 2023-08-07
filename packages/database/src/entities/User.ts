/* istanbul ignore file */
import { Entity, Property , OneToOne } from '@mikro-orm/core';
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
  
  @OneToOne({nullable:true})
  project?: Project

  constructor({ firstName, lastName }: UserConstructorValues) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

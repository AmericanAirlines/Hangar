/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type UserConstructorValues = ConstructorValues<User>;

@Entity()
export class User extends Node<User> {
  @Property({ columnType: 'text' })
  name: string;

  @Property({ columnType: 'text', nullable: true })
  pronouns?: string;

  @Property({ columnType: 'text', nullable: true })
  location?: string;

  @Property({ columnType: 'boolean' })
  hireable: boolean;

  @Property({ columnType: 'text' })
  purpose: string;

  @Property({ columnType: 'text', nullable: true })
  schoolName?: string;

  @Property({ columnType: 'text', nullable: true })
  major?: string;

  @Property({ columnType: 'Date', nullable: true })
  graduationDate?: Date;

  constructor({ name, hireable, purpose, ...extraValues }: UserConstructorValues) {
    super(extraValues);

    this.name = name;
    this.hireable = hireable;
    this.purpose = purpose;
  }
}

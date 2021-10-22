/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type UserConstructorValues = ConstructorValues<User>;

@Entity()
export class User extends Node<User> {
  @Property({ columnType: 'text' })
  authId: string;

  @Property({ columnType: 'text' })
  name: string;

  @Property({ columnType: 'boolean' })
  subscribed: boolean;

  @Property({ columnType: 'text', nullable: true })
  email?: string;

  @Property({ columnType: 'jsonb', nullable: true })
  metadata?: string;

  constructor({ name, authId, subscribed, ...extraValues }: UserConstructorValues) {
    super(extraValues);

    this.authId = authId;
    this.name = name;
    this.subscribed = subscribed;
  }
}

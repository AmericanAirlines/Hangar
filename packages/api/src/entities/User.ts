/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type UserConstructorValues = ConstructorValues<User, never, 'subscribed'>;
type UserPropertyKeys = keyof UserConstructorValues;

@Entity()
export class User extends Node<User> {
  SAFE_KEYS: UserPropertyKeys[] = ['name', 'subscribed'];

  @Property({ columnType: 'text', unique: true })
  authId: string;

  @Property({ columnType: 'text' })
  name: string;

  @Property({ columnType: 'boolean' })
  subscribed: boolean = false;

  @Property({ columnType: 'text', nullable: true })
  email?: string;

  @Property({ columnType: 'jsonb', nullable: true })
  metadata?: string;

  constructor({ name, authId, ...extraValues }: UserConstructorValues) {
    super(extraValues);

    this.authId = authId;
    this.name = name;
  }
}

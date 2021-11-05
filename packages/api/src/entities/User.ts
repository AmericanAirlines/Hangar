/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type UserConstructorValues = ConstructorValues<User, never, 'subscribed' | 'isAdmin'>;
type UserPropertyKeys = keyof UserConstructorValues;

@Entity()
export class User extends Node<User> {
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

  @Property({ default: false })
  isAdmin: boolean = false;

  constructor({ name, authId, ...extraValues }: UserConstructorValues) {
    super(extraValues);

    this.authId = authId;
    this.name = name;
  }

  getSafeKeys(req: Express.Request): UserPropertyKeys[] {
    const safeKeys: UserPropertyKeys[] = ['name', 'subscribed', 'isAdmin'];

    if (req.safeUserEntity?.isAdmin) {
      safeKeys.push('authId', 'email', 'metadata');
    }

    return safeKeys;
  }
}

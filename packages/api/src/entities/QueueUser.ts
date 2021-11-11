/* istanbul ignore file */
import { Entity, Enum, IdentifiedReference, ManyToOne } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';
import { User } from './User';

export type QueueUserConstructorValues = ConstructorValues<QueueUser>;
type QueueUserPropertyKeys = keyof QueueUserConstructorValues;

export enum QueueType {
  Idea = 'Idea',
  Tech = 'Tech',
  Job = 'Job',
}

export enum QueueStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Abandoned = 'Abandoned',
  Completed = 'Completed',
}

@Entity()
export class QueueUser extends Node<QueueUser> {
  @ManyToOne(() => User)
  user: IdentifiedReference<User>;

  @ManyToOne(() => User, { nullable: true })
  assignee?: IdentifiedReference<User>;

  @Enum({ columnType: 'text' })
  type: QueueType;

  @Enum({ columnType: 'text' })
  status: QueueStatus = QueueStatus.Pending;

  constructor({ user, type, ...extraValues }: QueueUserConstructorValues) {
    super(extraValues);

    this.user = user;
    this.type = type;
  }

  getSafeKeys(): QueueUserPropertyKeys[] {
    return ['user', 'type', 'status'];
  }
}

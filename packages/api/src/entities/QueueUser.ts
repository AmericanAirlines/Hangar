/* istanbul ignore file */
import { Entity, Property, Enum } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';
import { User } from './User';

export type QueueUserConstructorValues = ConstructorValues<QueueUser>;


export enum QueueType {
  Idea = 'Idea',
  Tech = 'Tech',
  Job = 'Job' };

export enum QueueStatus {
  Pending = 'Pending', 
  InProgress = 'InProgress',
  Abandoned = 'Abandoned',
  Completed = 'Completed' };

@Entity()
export class QueueUser extends Node<QueueUser> {
  @Property({ columnType: 'text' })
  userId: User;

  @Enum({ columnType: 'text' })
  type: QueueType;

  @Enum({ columnType: 'text' })
  status: QueueStatus = QueueStatus.Pending;

  constructor({ userId, type, status, ...extraValues }: QueueUserConstructorValues) {
    super(extraValues);

    this.userId = userId;
    this.type = type;
    this.status = status;
  }
}

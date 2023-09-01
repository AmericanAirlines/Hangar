import { ManyToOne, Property, Entity, Ref, EntityDTO } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Node } from './Node';
import { ConstructorValues } from '../types/ConstructorValues';
import { User } from './User';

export type JudgingSessionDTO = EntityDTO<JudgingSession>;

export type JudgingSessionConstructorValues = ConstructorValues<JudgingSession>;

@Entity()
export abstract class JudgingSession extends Node<JudgingSession> {
  @Property()
  inviteCode: string = v4();

  @ManyToOne({ entity: () => User, ref: true })
  createdBy: Ref<User>;

  constructor({ inviteCode, createdBy }: JudgingSessionConstructorValues) {
    super();

    this.inviteCode = inviteCode;
    this.createdBy = createdBy;
  }
}

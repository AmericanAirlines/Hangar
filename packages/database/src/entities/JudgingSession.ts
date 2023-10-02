import { Collection, EntityDTO, ManyToMany, ManyToOne, Property, Ref } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Node } from './Node';
import { ConstructorValues } from '../types/ConstructorValues';
import { User } from './User';
import { Project } from './Project';

export type JudgingSessionDTO = EntityDTO<JudgingSession>;

export type JudgingSessionConstructorValues = ConstructorValues<
  JudgingSession,
  'inviteCode' | 'projects'
>;

export abstract class JudgingSession extends Node<JudgingSession> {
  @Property({ unique: true })
  inviteCode: string = v4();

  @ManyToOne({ entity: () => User, ref: true })
  createdBy: Ref<User>;

  @ManyToMany({ entity: () => Project })
  projects = new Collection<Project>(this);

  constructor({ createdBy }: JudgingSessionConstructorValues) {
    super();

    this.createdBy = createdBy;
  }
}

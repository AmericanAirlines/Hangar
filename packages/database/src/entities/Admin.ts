import { Entity, Ref, EntityDTO, OneToOne } from '@mikro-orm/core';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';
import { User } from './User';

export type AdminDTO = EntityDTO<Admin>;

export type AdminConstructorValues = ConstructorValues<Admin>;

@Entity()
export class Admin extends Node<Admin> {
  @OneToOne({ entity: () => User, nullable: false, ref: true })
  user: Ref<User>;

  constructor({ user }: AdminConstructorValues) {
    super();

    this.user = user;
  }
}

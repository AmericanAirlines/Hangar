import { Entity, PrimaryKey, BigIntType, Property, EntityDTO } from '@mikro-orm/core';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';

export type AdminDTO = EntityDTO<Admin>;

export type AdminConstructorValues = ConstructorValues<Admin>;

@Entity()
export class Admin extends Node<Admin> {
  @PrimaryKey({ type: BigIntType })
  public id!: string;

  @Property({ unique: true })
  username: string;

  @Property()
  password: string;

  @Property({ unique: true })
  email: string;

  constructor({ username, password, email }: AdminConstructorValues) {
    super();

    this.username = username;
    this.password = password;
    this.email = email;
  }
}

/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';

export type PrizeConstructorValues = ConstructorValues<Prize, never, 'isBonus'>;

@Entity()
export class Prize extends Node<Prize> {
  @Property({ columnType: 'text' })
  name: string;

  @Property({ columnType: 'int', unique: true })
  position: number;

  @Property({ columnType: 'text', nullable: true })
  description?: string;

  @Property({ columnType: 'boolean' })
  isBonus: boolean;

  constructor({
    name,
    position,
    description,
    isBonus = false,
    ...extraValues
  }: PrizeConstructorValues) {
    super(extraValues);

    this.name = name;
    this.position = position;
    this.isBonus = isBonus;
  }
}

/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type PrizeConstructorValues = ConstructorValues<Prize>;
type PrizePropertyKeys = keyof PrizeConstructorValues;

@Entity()
export class Prize extends Node<Prize> {
  @Property({ columnType: 'text' })
  name: string;

  @Property({ columnType: 'int' })
  sortOrder: number;

  @Property({ columnType: 'text', nullable: true })
  description?: string;

  @Property({ columnType: 'boolean' })
  isBonus: boolean = false;

  constructor({ name, sortOrder, ...extraValues }: PrizeConstructorValues) {
    super(extraValues);

    this.name = name;
    this.sortOrder = sortOrder;
  }

}

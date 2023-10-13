/* istanbul ignore file */
import { Entity, Property, EntityDTO, Ref, ManyToOne } from '@mikro-orm/core';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';
import { Project } from './Project';

export type PrizeDTO = EntityDTO<Prize>;

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

  @ManyToOne({ entity: () => Project, nullable: true, ref: true })
  winner?: Ref<Project>;

  constructor({
    name,
    position,
    description,
    isBonus = false,
    winner,
    ...extraValues
  }: PrizeConstructorValues) {
    super(extraValues);

    this.name = name;
    this.position = position;
    this.isBonus = isBonus;
    this.winner = winner;
  }
}

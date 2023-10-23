/* istanbul ignore file */
import { Entity, Property, EntityDTO } from '@mikro-orm/core';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';

export type CriteriaDTO = EntityDTO<Criteria>;
type ConstructorArgs = ConstructorValues<Criteria>;

@Entity()
export class Criteria extends Node<Criteria> {
  @Property({ columnType: 'text' })
  title: string;

  @Property({ columnType: 'text' })
  description: string;

  @Property({ columnType: 'int' })
  weight: number;

  @Property({ columnType: 'int' })
  scaleMin: number;

  @Property({ columnType: 'int' })
  scaleMax: number;

  @Property({ columnType: 'text' })
  scaleDescription: string;

  constructor({
    title,
    description,
    weight,
    scaleMin,
    scaleMax,
    scaleDescription,
  }: ConstructorArgs) {
    super();

    this.title = title;
    this.description = description;
    this.weight = weight;
    this.scaleMin = scaleMin;
    this.scaleMax = scaleMax;
    this.scaleDescription = scaleDescription;
  }
}

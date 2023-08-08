/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';

export type EventConstructorValues = ConstructorValues<Event>;

@Entity()
export class Event extends Node<Event> {
  @Property({ columnType: 'text' })
  name: string;

  @Property()
  start: Date;

  @Property()
  end: Date;

  @Property({ columnType: 'text', nullable: true })
  description?: string;

  constructor({ name, start, end, description, ...extraValues }: EventConstructorValues) {
    super(extraValues);

    this.name = name;
    this.start = start;
    this.end = end;
    this.description = description;
  }
}

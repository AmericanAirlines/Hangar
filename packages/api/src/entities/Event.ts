/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type EventConstructorValues = ConstructorValues<Event>;

@Entity()
export class Event extends Node<Event> {
  @Property({ columnType: 'text' })
  name: string;

  @Property({ columnType: 'date' })
  start: Date;

  @Property({ columnType: 'date' })
  end: Date;

  @Property({ columnType: 'text', nullable: true })
  description?: string;

  constructor({ name, start, end, description,...extraValues }: EventConstructorValues) {
    super(extraValues);

    this.name = name;
    this.start = start;
    this.end = end;
    this.description = description;
  }
}

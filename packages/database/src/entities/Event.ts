/* istanbul ignore file */
import { Entity, Property, EntityDTO } from '@mikro-orm/core';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';

export type EventDTO = EntityDTO<Event>;

export type EventConstructorValues = ConstructorValues<Event, never, 'description'>;

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

  constructor({ name, start, end, ...extraValues }: EventConstructorValues) {
    super(extraValues);

    this.name = name;
    this.start = start;
    this.end = end;
  }
}

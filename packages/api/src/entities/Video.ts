/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type VideoConstructorValues = ConstructorValues<Video>;

@Entity()
export class Video extends Node<Video> {
  @Property({ columnType: 'text' })
  title: string;

  @Property({ columnType: 'int' })
  durationInSeconds: number;

  @Property({ columnType: 'text' })
  url: string;

  constructor({ title, durationInSeconds, url, ...extraValues }: VideoConstructorValues) {
    super(extraValues);

    this.title = title;
    this.durationInSeconds = durationInSeconds;
    this.url = url;
  }
}

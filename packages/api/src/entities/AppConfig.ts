/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export enum ConfigKey {}

type JSONValue = string | number | boolean | Record<string, any> | any[];

export type AppConfigConstructorValues = ConstructorValues<AppConfig>;
type AppConfigPropertyKeys = keyof AppConfigConstructorValues;

@Entity()
export class AppConfig extends Node<AppConfig> {
  @Property({ columnType: 'text' })
  key: ConfigKey;

  @Property({ columnType: 'jsonb', nullable: true })
  value: JSONValue | null;

  constructor({ key, value, ...extraValues }: AppConfigConstructorValues) {
    super(extraValues);

    this.key = key;
    this.value = value;
  }

  getSafeKeys(): AppConfigPropertyKeys[] {
    return ['key', 'value'];
  }
}

/* eslint-disable max-lines */
/* istanbul ignore file */
import { Entity, Property, EntityManager } from '@mikro-orm/core';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';

export enum ConfigKey {}

type JSONValue = string | number | boolean | Record<string, any> | any[];

export type AppConfigConstructorValues = ConstructorValues<AppConfig>;
type AppConfigPropertyKeys = keyof AppConfigConstructorValues;

@Entity()
export class AppConfig extends Node<AppConfig> {
  @Property({ columnType: 'text', unique: true })
  key: ConfigKey;

  @Property({ columnType: 'jsonb', nullable: true })
  value: JSONValue | null;

  constructor({ key, value, ...extraValues }: AppConfigConstructorValues) {
    super(extraValues);

    this.key = key;
    this.value = value;
  }

  static getSafeKeys(): AppConfigPropertyKeys[] {
    return ['key', 'value'];
  }

  /**
   * Get the value of a Config item that is a string, and return null if it's not
   */
  static async getValueAs(
    em: EntityManager,
    key: ConfigKey,
    valueType: 'string',
    shouldThrow: false,
  ): Promise<string | null>;

  /**
   * Get the value of a Config item that is a string, and throw an error if it's not
   */
  static async getValueAs(
    em: EntityManager,
    key: ConfigKey,
    valueType: 'string',
    shouldThrow: true,
  ): Promise<string>;

  /**
   * Get the value of a Config item that is a boolean, and return null if it's not
   */
  static async getValueAs(
    em: EntityManager,
    key: ConfigKey,
    valueType: 'boolean',
    shouldThrow: false,
  ): Promise<boolean | null>;

  /**
   * Get the value of a Config item that is a boolean, and throw an error if it's not
   */
  static async getValueAs(
    em: EntityManager,
    key: ConfigKey,
    valueType: 'boolean',
    shouldThrow: true,
  ): Promise<boolean>;

  /**
   * Get the value of a Config item that is a number, and return null if it's not
   */
  static async getValueAs(
    em: EntityManager,
    key: ConfigKey,
    valueType: 'number',
    shouldThrow: false,
  ): Promise<number | null>;

  /**
   * Get the value of a Config item that is a number, and throw an error if it's not
   */
  static async getValueAs(
    em: EntityManager,
    key: ConfigKey,
    valueType: 'number',
    shouldThrow: true,
  ): Promise<number>;

  /**
   * Get the value of a Config item that is a object, and return null if it's not
   */
  static async getValueAs(
    em: EntityManager,
    key: ConfigKey,
    valueType: 'object',
    shouldThrow: false,
  ): Promise<Record<string, any> | null>;

  /**
   * Get the value of a Config item that is a object, and throw an error if it's not
   */
  static async getValueAs(
    em: EntityManager,
    key: ConfigKey,
    valueType: 'object',
    shouldThrow: true,
  ): Promise<Record<string, any>>;

  /**
   * Get the value of a Config item that is a array, and return null if it's not
   */
  static async getValueAs(
    em: EntityManager,
    key: ConfigKey,
    valueType: 'array',
    shouldThrow: false,
  ): Promise<any[] | null>;

  /**
   * Get the value of a Config item that is a array, and throw an error if it's not
   */
  static async getValueAs(
    em: EntityManager,
    key: ConfigKey,
    valueType: 'array',
    shouldThrow: true,
  ): Promise<any[]>;

  static async getValueAs(
    em: EntityManager,
    key: ConfigKey,
    valueType: 'string' | 'boolean' | 'number' | 'object' | 'array',
    shouldThrow: boolean,
  ): Promise<string | boolean | number | Record<string, any> | null> {
    try {
      const item = await em.findOne(AppConfig, { key });

      if (!item) {
        if (shouldThrow) {
          throw new Error(`No config item with the key ${key}`);
        } else {
          return null;
        }
      }

      if (item.value === null && shouldThrow) {
        throw new Error('Value was null');
      }

      if (valueType === 'array' && !Array.isArray(item.value)) {
        throw new Error(`Value is not an array. It is of type ${typeof item.value}`);
      }

      if (valueType !== 'array' && typeof item.value !== valueType) {
        throw new Error(
          `Value was of undesired type. Requested type was ${valueType} but found ${typeof item.value}.`,
        );
      }

      return item.value;
    } catch (err) {
      if (shouldThrow) {
        throw err;
      } else {
        return null;
      }
    }
  }
}

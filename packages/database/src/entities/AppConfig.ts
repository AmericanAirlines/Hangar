/* istanbul ignore file */
import { Entity, Property, EntityManager } from '@mikro-orm/core';
import { ConstructorValues } from '../types/ConstructorValues';
import { Node } from './Node';

export enum AppConfigKey {
  Test,
}

type JSONValue = string | number | boolean | Record<string, any> | any[];

export type AppConfigConstructorValues = ConstructorValues<AppConfig>;

type GetValueAsArgs = {
  entityManager: EntityManager;
  key: AppConfigKey;
};

type GetValueAsArgsWithForcedType = GetValueAsArgs & {
  forceType: 'number' | 'string' | 'array' | 'object';
};

@Entity()
export class AppConfig extends Node<AppConfig> {
  @Property({ columnType: 'text', unique: true })
  key: AppConfigKey;

  @Property({ columnType: 'jsonb', nullable: true })
  value: JSONValue | null;

  constructor({ key, value, ...extraValues }: AppConfigConstructorValues) {
    super(extraValues);

    this.key = key;
    this.value = value;
  }

  /**
   * @template T {@link JSONValue} used to specify the return type of the data
   * @param args {@link GetValueAsArgs} or {@link GetValueAsArgsWithForcedType}
   * @returns the value coerced to the specified type
   *
   * @example
   *
    void AppConfig.getValueAs<string>({
      entityManager: em,
      key: AppConfigKey.Test,
      forceType: 'string',
    }).then((item) => {
      console.log(item); // item is of type 'string'
    });
   */
  static async getValueAs<T extends JSONValue>(args: GetValueAsArgs): Promise<T | null>;
  static async getValueAs<T extends JSONValue>(args: GetValueAsArgsWithForcedType): Promise<T>;
  static async getValueAs<T extends JSONValue>(
    args: GetValueAsArgs | GetValueAsArgsWithForcedType,
  ): Promise<T | null> {
    const { entityManager: em, key } = args;
    const item = await em.findOne(AppConfig, { key });

    if (!item) {
      throw new Error(`No config item with the key ${key}`);
    }

    if ('forceType' in args) {
      const { forceType } = args;
      if (forceType === 'array') {
        if (!Array.isArray(item.value)) {
          throw new Error(`Value is not an array. It is of type ${typeof item.value}`);
        }
      } else if (typeof item.value !== forceType) {
        throw new Error(
          `Value was of undesired type. Requested type was ${forceType} but found ${typeof item.value}`,
        );
      }

      return item.value as T;
    }

    return item.value as T | null;
  }
}

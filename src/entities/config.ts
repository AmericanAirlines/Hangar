/* eslint-disable no-dupe-class-members */

import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm';

@Entity('configuration')
export class Config extends BaseEntity {
  constructor(key: string, value: string) {
    super();

    this.key = key;
    this.value = value;
  }

  @PrimaryColumn()
  key: string;

  @Column({ type: 'jsonb', nullable: true, default: null })
  value: string | number | boolean | null;

  static async findToggleForKey(key: string): Promise<boolean> {
    const toggle = await this.findOne({ key });
    // QUESTION: I believe I should still check if toggle is null here?
    // UPDATE: Seems like we could also replace this with the getValueAs method.
    if (toggle && typeof toggle.value === 'string') {
      toggle.value = toggle.value.toLowerCase();
      if (toggle.value !== 'false' && toggle.value !== 'true') {
        throw new Error('Config item found but cannot be cast to boolean');
      }
    }
    return toggle ? toggle.value === 'true' : false;
  }

  static async getValueAs(key: string, valueType: 'string', shouldThrow: true): Promise<string>;

  static async getValueAs(key: string, valueType: 'boolean', shouldThrow: true): Promise<boolean>;

  static async getValueAs(key: string, valueType: 'number', shouldThrow: true): Promise<number>;

  static async getValueAs(key: string, valueType: 'string', shouldThrow: false): Promise<string | null>;

  static async getValueAs(key: string, valueType: 'boolean', shouldThrow: false): Promise<boolean | null>;

  static async getValueAs(key: string, valueType: 'number', shouldThrow: false): Promise<number | null>;

  static async getValueAs(key: string, valueType: 'string' | 'boolean' | 'number', shouldThrow: boolean): Promise<string | boolean | number | null> {
    const something = await this.findOne({ key });

    if (something.value === null) {
      if (shouldThrow) {
        throw new Error('Value was null');
      } else {
        return null;
      }
    }

    switch (valueType) {
      case 'string': {
        const castValueAsString: string = something.value as string;
        if (castValueAsString === null) {
          if (shouldThrow) {
            throw new Error('Value could not be cast to string');
          } else {
            return null;
          }
        } else {
          return castValueAsString;
        }
      }
      case 'boolean': {
        const castValueAsBool: boolean = something.value as boolean;
        if (castValueAsBool === null) {
          if (shouldThrow) {
            throw new Error('Value could not be cast to boolean');
          } else {
            return null;
          }
        } else {
          return castValueAsBool;
        }
      }
      case 'number': {
        const castValueAsNumber: number = something.value as number;
        if (castValueAsNumber === null) {
          if (shouldThrow) {
            throw new Error('Value could not be cast to boolean');
          } else {
            return null;
          }
        } else {
          return castValueAsNumber;
        }
      }
      default: {
        throw new Error('no appropriate valueType detected');
      }
    }
  }
}

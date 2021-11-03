import {
  AnyEntity,
  BaseEntity,
  BigIntType,
  IdentifiedReference,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

export type AnyNode = Node<AnyEntity>;

const isReference = (val: any): val is IdentifiedReference<AnyNode> =>
  typeof val === 'object' && val && 'isInitialized' in val;

export abstract class Node<T extends AnyEntity> extends BaseEntity<T, 'id'> {
  abstract SAFE_KEYS: Array<keyof T>;

  @PrimaryKey({ type: BigIntType })
  public id!: string;

  @Property({ defaultRaw: 'clock_timestamp()' })
  public createdAt!: Date;

  @Property({
    defaultRaw: 'clock_timestamp()',
    onUpdate: /* istanbul ignore next */ () => new Date(),
  })
  public updatedAt!: Date;

  constructor(extraFields: Partial<T> = {}) {
    super();

    for (const [key, value] of Object.entries(extraFields) as [keyof T, T[keyof T]][]) {
      (this as unknown as T)[key] = value;
    }
  }

  toSafeJSON() {
    const json = this.toJSON();

    for (const [key, val] of Object.entries(this) as Array<
      [keyof Node<T>, Node<T>[keyof Node<T>] | IdentifiedReference<AnyNode>]
    >) {
      if (isReference(val) && val.isInitialized()) {
        json[key] = { id: val.id };
      }
    }

    const safeJson: Record<string, any> = {};

    for (const [key, val] of Object.entries(json)) {
      if (this.SAFE_KEYS.includes(key)) {
        safeJson[key] = val;
      }
    }

    return safeJson;
  }
}

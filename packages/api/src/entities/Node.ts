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

  abstract getSafeKeys(req: Express.Request): Array<keyof T>;

  toSafeJSON(req: Express.Request) {
    const json = this.toJSON();

    for (const [key, val] of Object.entries(this) as Array<
      [keyof Node<T>, Node<T>[keyof Node<T>] | IdentifiedReference<AnyNode>]
    >) {
      if (isReference(val) && val.isInitialized()) {
        json[key] = { id: val.id };
      }
    }

    const safeJson: Record<string, any> = {};
    const safeKeys = ['id', 'createdAt', 'updatedAt', ...this.getSafeKeys(req)];

    for (const [key, val] of Object.entries(json)) {
      if (safeKeys.includes(key)) {
        safeJson[key] = val;
      }
    }

    return safeJson;
  }
}

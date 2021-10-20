import { AnyEntity, BaseEntity, BigIntType, PrimaryKey, Property } from '@mikro-orm/core';

export type AnyNode = Node<AnyEntity>;

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
}

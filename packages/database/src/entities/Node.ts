import { AnyEntity, BaseEntity, BigIntType, PrimaryKey, Property } from '@mikro-orm/core';

export abstract class Node<T extends AnyEntity> extends BaseEntity {
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

    for (let i = 0; i < Object.entries(extraFields).length; i += 1) {
      const [key, value] = Object.entries(extraFields) as [keyof T, T[keyof T]];
      (this as unknown as T)[key] = value;
    }
  }
}

import { AnyEntity } from '@mikro-orm/core';
import { Node } from '../entities/Node';

export type SetOptional<Obj, Keys extends keyof Obj> = Omit<Obj, Keys> & {
  [K in Keys]?: Obj[K];
};

export type OmitMethods<Obj extends object> = {
  [K in keyof Obj as Obj[K] extends Function ? never : K]: Obj[K];
};

type NodeProperties = OmitMethods<Node<AnyEntity>>;

type OmitNodeProperties<Entity extends AnyEntity> = Entity extends NodeProperties
  ? Omit<Entity, keyof NodeProperties>
  : Entity;

/**
 * A generic for defining the constructor properties of an entity excluding those from {@link Node}.
 * @param Entity - The entity to define the constructor properties for.
 * @param RemovedKeys - Keys to remove from the entity (properties that will **never** be set via the constructor)
 * @param OptionalKeys - Keys that can be optionally set in the constructor.
 */
export type ConstructorValues<
  Entity extends AnyEntity,
  RemovedKeys extends keyof OmitMethods<OmitNodeProperties<Entity>> = never,
  OptionalKeys extends keyof OmitMethods<Omit<OmitNodeProperties<Entity>, RemovedKeys>> = never,
> = SetOptional<OmitMethods<Omit<OmitNodeProperties<Entity>, RemovedKeys>>, OptionalKeys>;

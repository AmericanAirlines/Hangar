import { AnyNode, Node } from '../entities/Node';

export type SetOptional<Obj, Keys extends keyof Obj> = Omit<Obj, Keys> & {
  [K in Keys]?: Obj[K];
};

export type OmitMethods<Obj extends object> = {
  [K in keyof Obj as Obj[K] extends Function ? never : K]: Obj[K];
};

export type ConstructorValues<
  Entity extends AnyNode,
  RemovedKeys extends keyof OmitMethods<Omit<Entity, keyof Node<Entity>>> = never,
  OptionalKeys extends keyof OmitMethods<Omit<Entity, keyof Node<Entity> | RemovedKeys>> = never,
> = SetOptional<OmitMethods<Omit<Entity, keyof Node<Entity> | RemovedKeys>>, OptionalKeys>;

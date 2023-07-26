import { AnyEntity } from '@mikro-orm/core';
import { Node } from '../../src/entities/Node';

export type FakerEntity<T extends AnyEntity, K extends keyof T = never> = Omit<
  Omit<T, keyof Node<T>>,
  K
>;

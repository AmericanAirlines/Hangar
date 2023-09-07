export type Pretty<K> = {
  [T in keyof K]: K[T];
} & {};

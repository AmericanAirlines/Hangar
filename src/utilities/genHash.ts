export const genHash = (): string => {
  const prefix = Math.random()
    .toString(36)
    .substring(2, 15);

  const suffix = Math.random()
    .toString(36)
    .substring(2, 15);

  return prefix + suffix;
};

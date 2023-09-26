import { env } from '../../src/env';

type Env = Partial<Record<keyof typeof env, string>>;

const defaults: Env = {
  nodeEnv: 'test',
  sessionSecret: 'tacocat',
};

export const mockEnv = (envData?: Env) => {
  (env as Env) = { ...defaults, ...envData };
};

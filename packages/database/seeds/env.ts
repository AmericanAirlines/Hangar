/* istanbul ignore file */
import { config } from 'dotenv-flow';
import setEnv from '@americanairlines/simple-env';

config({ path: __dirname });

export const env = setEnv({
  optional: {},
});

/* istanbul ignore file */
import { config } from 'dotenv-flow';
import setEnv from '@americanairlines/simple-env';

config({ path: __dirname });

export const env = setEnv({
  optional: {
    primaryUserEmail: 'PRIMARY_USER_EMAIL',
    primaryUserFirstName: 'PRIMARY_USER_FIRST_NAME',
    primaryUserLastName: 'PRIMARY_USER_LAST_NAME',
    primaryUserIsAdmin: 'PRIMARY_USER_IS_ADMIN',
    primaryUserIsJudge: 'PRIMARY_USER_IS_JUDGE',
  },
});
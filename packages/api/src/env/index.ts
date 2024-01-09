import { config } from 'dotenv-flow';

config(); // Must be called before exports

/**
 * All core environment variables
 */
export * from './env';

/**
 * All auth environment variables
 */
export * as Auth from './auth';

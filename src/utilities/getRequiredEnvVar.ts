import logger from '../logger';

export default function getRequiredEnvVar(varName: string): string {
  const envVar = process.env[varName];
  if (!envVar && process.env.NODE_ENV !== 'test') {
    logger.crit(`Required env var ${varName} was not set`);
    process.exit(1);
  }
  return envVar;
}

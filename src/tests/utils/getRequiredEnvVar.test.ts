/* eslint-disable @typescript-eslint/no-var-requires, global-require */
import 'jest';
import getRequiredEnvVar from '../../utils/getRequiredEnvVar';
import logger from '../../logger';

const processExitSpy = jest.spyOn(process, 'exit');
const loggerCritSpy = jest.spyOn(logger, 'crit').mockImplementation();

describe('getRequiredEnvVar', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    processExitSpy.mockImplementation();
    process.env.NODE_ENV = 'test';
  });

  it('will retrieve a set env var', async () => {
    const varName = 'SOME_VAR';
    const expectedValue = 'Something secret';

    process.env[varName] = expectedValue;
    expect(getRequiredEnvVar(varName)).toEqual(expectedValue);
  });

  it('will exit the process if a required var is not set in a non-test environment', async () => {
    const varName = 'SOMETHING_NOT_SET';
    process.env.NODE_ENV = 'development';
    getRequiredEnvVar(varName);
    expect(processExitSpy).toBeCalled();
    expect(loggerCritSpy).toBeCalled();
  });

  it('will return undefined for an unset required value if in the test environment', async () => {
    const varName = 'SOMETHING_NOT_SET';
    process.env.NODE_ENV = 'development';
    expect(getRequiredEnvVar(varName)).toEqual(undefined);
  });
});

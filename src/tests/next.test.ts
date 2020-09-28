/* eslint-disable implicit-arrow-linebreak, function-paren-newline */

import 'jest';
import logger from '../logger';
import { closeDbConnection, createDbConnection } from './testdb';

jest.spyOn(logger, 'crit').mockImplementation();
jest.spyOn(logger, 'error').mockImplementation();
jest.spyOn(logger, 'info').mockImplementation();

jest.spyOn(process, 'exit').mockImplementation();
jest.mock('@slack/web-api', () => ({
  // eslint-disable-next-line object-shorthand, func-names, @typescript-eslint/explicit-function-return-type, space-before-function-paren
  WebClient: function() {
    return {
      auth: {
        test: (): Promise<void> => Promise.resolve(),
      },
    };
  },
}));

describe('next.js', () => {
  beforeEach(async () => {
    await createDbConnection();
  });

  afterEach(async () => {
    await closeDbConnection();
  });

  it('will not hold up app start when not in production', async () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });

    const nextPrepareDone = jest.fn().mockName('nextPrepareDone()');

    jest.mock('next', () => (): object => ({
      getRequestHandler: () => (): object => ({}),
      prepare: (): Promise<void> =>
        new Promise((resolve) =>
          setTimeout(() => {
            nextPrepareDone();
            resolve();
          }, 5000),
        ),
    }));

    const app = await import('../app');

    await app.init();

    expect(nextPrepareDone).not.toBeCalled();
  });
});

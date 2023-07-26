/* istanbul ignore file */

// THIS FILE IS ONLY USED WHEN RUNNING THE WEB hangar INDEPENDENTLY
import path from 'path';
import type { Handler } from 'express';
import next from 'next';

interface WebOptions {
  dev: boolean;
}

export const web = async ({ dev }: WebOptions): Promise<Handler> => {
  const nextApp = next({ dev, dir: path.join(__dirname, '..') });
  const handle = nextApp.getRequestHandler();

  const nextAppPreparePromise = nextApp.prepare();

  // We don't want to start the server if next is still preparing
  if (!dev) await nextAppPreparePromise;

  return async (req, res) => {
    await nextAppPreparePromise;

    return handle(req, res);
  };
};

import { Handler, Router } from 'express';

/**
 * Create a new router that can test a piece of middleware
 * @param middleware The middleware to test
 * @returns A router to use for the test handler
 */
export const createTestRouter = (...handlers: Handler[]) => {
  const router = Router();

  for (const handler of handlers) {
    router.use(handler);
  }

  router.get('/', (_req, res) => {
    res.sendStatus(200);
  });

  return router;
};

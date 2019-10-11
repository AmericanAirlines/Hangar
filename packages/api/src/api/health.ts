import { Router } from 'express';

export const health = Router();

health.get('', (_req, res) => {
  res.send({
    ok: true,
  });
});

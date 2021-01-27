import express from 'express';

export const health = express.Router();
health.get('/health', (_, res) => {
  res.send({
    status: 'OK',
    details: 'Everything looks good 👌',
    time: new Date().toISOString(),
  });
});

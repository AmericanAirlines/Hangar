import express from 'express';
import { env } from '../env';

export const admin = express.Router();

admin.use(express.json());

admin.post('/login', (req, res): void => {
  if (req.body.secret !== env.adminSecret) {
    res.status(401).send('Incorrect secret');
    return;
  }

  res
    .status(200)
    .cookie('authed', 'yes', {
      maxAge: 48 * 60 * 60 * 1000, // 48 hours
      httpOnly: true,
      signed: true,
    })
    .send();
});

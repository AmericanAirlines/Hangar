import express from 'express';
import { Config } from '../entities/config';

export const admin = express.Router();

admin.use(express.json());

admin.post(
  '/login',
  async (req, res): Promise<void> => {
    const adminSecret = await Config.getValueAs('adminSecret', 'string', false);
    if (!adminSecret) {
      res.status(500).send('Secret not initialized');
      return;
    }
    if (req.body.secret !== adminSecret) {
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
  },
);

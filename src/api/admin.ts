import express from 'express';
import { Config } from '../entities/config';
import logger from '../logger';

export const admin = express.Router();

admin.use(express.json());

admin.post(
  '/login',
  async (req, res): Promise<void> => {
    const adminSecret = await Config.findOne('adminSecret');
    if (!adminSecret.value) {
      res.status(500).send('Secret not initialized');
      logger.crit;
      return;
    }
    if (req.body.secret !== adminSecret.value) {
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

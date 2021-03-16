import express from 'express';
import { Config } from '../entities/config';

export const admin = express.Router();

admin.use(express.json());

admin.post('/login', async (req, res): Promise <void> => {
  const adminSecret = await Config.findOneOrFail('adminSecret');
  if(adminSecret.value === ''){
    res.status(401).send('Secret not initialized');
    return;
  }
  else if (req.body.secret !== adminSecret.value) {
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

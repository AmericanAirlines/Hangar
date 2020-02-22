import 'dotenv/config';
import express from 'express';
import { requireAuth } from './middleware/requireAuth';
import { supportRequestRoutes } from './supportRequest';
import { Judge } from '../entities/judge';
import { sendUpdateMessage } from './sendUpdateMessage';
import { judging } from './judging';
import { config } from './config';
import { admin } from './admin';
import { judgeActions } from './judge';

const api = express();

api.use(express.json());

api.get('/', (_req, res) => {
  res.send('🌊');
});

api.post('/judge', async (_req, res) => {
  const judge = await new Judge().save();

  res.send(judge.id.toString());
});

api.use(judgeActions);
api.use('/sendUpdateMessage', requireAuth(), sendUpdateMessage);
api.use('/supportRequest', requireAuth(), supportRequestRoutes);
api.use('/judging', requireAuth(), judging);
api.use('/config', requireAuth(), config);
api.use('/admin', admin);

export const apiApp = api;

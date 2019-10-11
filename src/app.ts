import express from 'express';
import { slackApp } from './slack';

const app = express();

app.get('/', (_req, res) => {
  res.send('👋');
});

app.use(slackApp);

export default app;

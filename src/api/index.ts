import 'dotenv/config';
import express from 'express';

const api = express();

api.get('/', (_req, res) => {
  res.send('🌊');
});

export const apiApp = api;

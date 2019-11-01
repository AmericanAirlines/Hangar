import 'dotenv/config';
import express from 'express';

const api = express();

api.get('/', (_req, res) => {
  res.send('🌊');
});

api.post('/judge', () => {
  // TODO: Create a new judge and return the id
  // The site will save the id to local storage and use it for future requests
});

api.get('/judge/teams', () => {
  // TODO: Return the judge's (req.query.judgeId) previous team and a new current team
});

api.post('/vote', () => {
  // TODO: Do this
  // Find judge by req.body.judgeId
  // Save vote record with req.body.previousTeamId, req.body.currenTeamId, and req.body.currentTeamChosen
});

export const apiApp = api;

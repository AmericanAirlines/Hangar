import express from 'express';
import logger from '../logger';
import { JudgingVote, insufficientVoteCountError } from '../entities/judgingVote';

export const judging = express.Router();

judging.get('/results', async (req, res) => {
  try {
    const results = await JudgingVote.tabulate();
    res.send(results);
  } catch (err) {
    if (err.name === insufficientVoteCountError) {
      res.status(200).send({ error: 'Insufficient vote count to calculate results' });
      return;
    }

    res.status(500).send('Unable to retrieve judging results');
    logger.error(err);
  }
});

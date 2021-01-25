import express from 'express';
import { Team } from '../entities/team';
import logger from '../logger';

export const team = express.Router();

team.get('/getAll', async (req, res) => {
  try {
    const teamList = await Team.find();
    res.status(200).send(teamList);
  } catch (error) {
    logger.error('Unable to retrieve team list: ', error);
    res.status(500).send('There Was An Internal Server Error');
  }
});

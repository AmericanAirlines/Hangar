import express from 'express';
import { Team } from '../entities/team';
import logger from '../logger';

export const supportRoutes = express.Router();

supportRoutes.get('/getAllTeams', async (req, res) => {
  try {
    const teamList = await Team.find();
    res.send(teamList);
  } catch (error) {
    logger.error('Unable to retrieve team list: ', error);
    res.status(500).send('There Was An Internal Server Error');
  }
});

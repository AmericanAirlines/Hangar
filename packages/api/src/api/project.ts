import { Router } from 'express';
import logger from '../logger';
import { Project } from '../entities/Project';

export const project = Router();

project.get('/', async (req, res) => {
  try {
    const userProject = await req.entityManager.findOne(Project, {
      user: req.userEntity.toReference(),
    });

    if (!userProject) {
      res.sendStatus(404);
      return;
    }

    res.status(200).send(userProject);
  } catch (error) {
    const errorMsg = 'Uh oh, looks like there was an issue fetching your project!';
    logger.error(`${errorMsg}: `, error);
    res.status(500).send(errorMsg);
  }
});

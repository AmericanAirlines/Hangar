import { Request, Response } from 'express';
import { Project } from '@hangar/database';
import { logger } from '../../utils/logger';

export const get = async (req: Request, res: Response) => {
  const { entityManager } = req;
  try {
    const projects = await entityManager.find(Project, {});
    res.send(projects);
  } catch (error) {
    logger.error('Unable to fetch projects from DB: ', error);
    res.sendStatus(500);
  }
};

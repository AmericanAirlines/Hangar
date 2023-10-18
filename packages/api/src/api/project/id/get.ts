import { Project } from '@hangar/database';
import { Request, Response } from 'express';
import { logger } from '../../../utils/logger';

export const get = async (req: Request, res: Response) => {
  const {
    entityManager,
    params: { id: projectId },
  } = req;
  try {
    const project = await entityManager.findOne(Project, { id: projectId as string });
    if (!project) {
      res.sendStatus(404);
      return;
    }
    res.send(project);
  } catch (error) {
    logger.error('Unable to fetch project details', error);
    res.sendStatus(500);
  }
};

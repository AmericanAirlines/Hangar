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
    }
    res.send(project?.id);
  } catch (error) {
    logger.error('Unable to fetch project details from dB', error);
    res.sendStatus(500);
  }
};

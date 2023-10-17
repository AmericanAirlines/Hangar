import { Request, Response } from 'express';
import { SerializedExpoJudgingSessionProjects } from '@hangar/shared';
import { ExpoJudgingSession } from '@hangar/database';
import { logger } from '../../../../utils/logger';

export const get = async (req: Request, res: Response) => {
  const {
    judge,
    entityManager: em,
    params: { id: ejsId },
  } = req;

  try {
    const ejs = await em.findOne(ExpoJudgingSession, { id: ejsId as string });

    if (!ejs) {
      res.sendStatus(404);
    }

    const contexts = await judge.expoJudgingSessionContexts.load({
      populate: ['currentProject.contributors', 'previousProject.contributors'],
    });

    const validEjsContext = contexts
      .getItems()
      .find((ejsc) => ejsc.expoJudgingSession.id === ejsId);

    if (validEjsContext) {
      const { currentProject, previousProject } = validEjsContext;
      const ejsProjects: SerializedExpoJudgingSessionProjects = {
        currentProject: currentProject?.$.serialize(),
        previousProject: previousProject?.$.serialize(),
      };
      res.send(ejsProjects);
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    logger.error('Failed to query Expo Judging Session Context', error);
    res.sendStatus(500);
  }
};

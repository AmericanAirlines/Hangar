import { Request, Response } from 'express';
import { Project, User } from '@hangar/database';
import { DriverException, LockMode } from '@mikro-orm/core';
import { logger } from '../../utils/logger';

export const post = async (req: Request, res: Response) => {
  const { entityManager, user } = req;
  const data = req.body;

  // const { errorHandled, data } = validatePayload({ req, res, schema: Schema.project.post });
  // if (errorHandled) return;

  try {
    await entityManager.transactional(async (em) => {
      const lockedUser = await em.findOneOrFail(
        User,
        { id: user.id, project: undefined },
        { lockMode: LockMode.PESSIMISTIC_WRITE_OR_FAIL },
      );

      const project = new Project(data);
      project.contributors.add(lockedUser);

      em.persist(project);
    });
  } catch (error) {
    if ((error as Error).name === 'NotFoundError') {
      // User already has project
      res.sendStatus(409);
      return;
    }
    if ((error as DriverException).code === '55P03') {
      // Locking error
      res.sendStatus(423);
      return;
    }
    // All other errors
    logger.error(error);
    res.sendStatus(500);
  }

  res.sendStatus(200);
};

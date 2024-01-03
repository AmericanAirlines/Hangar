import { Request, Response } from 'express';
import { DriverException, LockMode } from '@mikro-orm/core';
import { Project, User } from '@hangar/database';
import { Schema } from '@hangar/shared';
import { logger } from '../../../utils/logger';
import { validatePayload } from '../../../utils/validatePayload';

export const put = async (req: Request, res: Response) => {
  const { entityManager, user } = req;

  const { errorHandled, data } = validatePayload({
    req,
    res,
    schema: Schema.project.contributors.put,
  });
  if (errorHandled) return;

  let project: Project;
  try{
    project = await entityManager.findOneOrFail(Project, { inviteCode:data.inviteCode });
  }
  catch {
    res.sendStatus(404);
    return;
  }

  try {
    // Check that project is not already associated with the user
    await entityManager.transactional(async (em) => {
      const lockedUser = await em.findOneOrFail(
        User,
        { id: user.id, project: undefined },
        { lockMode: LockMode.PESSIMISTIC_WRITE_OR_FAIL },
      );

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
    return;
  }

  res.send(project);
};

import { Request, Response } from 'express';
import { Project, User } from '@hangar/database';
import { Schema } from '@hangar/shared';
import { DriverException, LockMode } from '@mikro-orm/core';
import axios from 'axios';
import { logger } from '../../utils/logger';
import { validatePayload } from '../../utils/validatePayload';

export const post = async (req: Request, res: Response) => {
  const { entityManager, user } = req;

  const { errorHandled, data } = validatePayload({ req, res, schema: Schema.project.post });
  if (errorHandled) return;

  let project: Project | undefined;

  try {
    const repoFetchRes = await axios.get(data.repoUrl);
    if (repoFetchRes.status !== 200) {
      throw new Error('Failed to find repo');
    }
  } catch {
    res
      .status(400)
      .send('Repo URL could not be validated; make sure your repo is publicly accessible');
    return;
  }

  try {
    await entityManager.transactional(async (em) => {
      // Identify the correct user and lock the row
      // Part of this check makes sure a project is not associated with the user
      const lockedUser = await em.findOneOrFail(
        User,
        { id: user.id, project: undefined },
        { lockMode: LockMode.PESSIMISTIC_WRITE_OR_FAIL },
      );

      project = new Project(data);
      project.contributors.add(lockedUser);
      em.persist(project);
    });
    if (!project) throw new Error('Project not created');
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
    if ((error as DriverException).code === '23505') {
      // Duplicate key error
      res.status(400).send('Project with that location already exists');
      return;
    }
    // All other errors
    logger.error(error);
    res.sendStatus(500);
    return;
  }

  const projectWithInviteCode = { ...project.toPOJO(), inviteCode: project.inviteCode };
  res.send(projectWithInviteCode);
};

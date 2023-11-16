import { Request, Response } from 'express';
import { Project } from '@hangar/database';
import { Schema } from '@hangar/shared';
import { DriverException } from '@mikro-orm/core';
import axios from 'axios';
import { logger } from '../../../utils/logger';
import { validatePayload } from '../../../utils/validatePayload';

export const put = async (req: Request, res: Response) => {
  const { entityManager, user } = req;
  const { id: projectId } = req.params;

  const { errorHandled, data } = validatePayload({ req, res, schema: Schema.project.put });
  if (errorHandled) return;

  if (!user.project || user.project.id !== projectId) {
    res.sendStatus(403);
    return;
  }

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
    const project = await entityManager.findOneOrFail(Project, { id: projectId });

    project.assign(data);
    await entityManager.persistAndFlush(project);

    res.send(project);
  } catch (error) {
    // All other errors
    logger.error(error);
    res.sendStatus(500);
  }
};

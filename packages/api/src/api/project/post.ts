import { Schema } from '@hangar/shared';
import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { validatePayload } from '../../utils/validatePayload';
import { Project, User } from '@hangar/database';

export const post = async (req: Request, res: Response) => {
  const { entityManager: em, user } = req;

  const { errorHandled, data } = validatePayload({ req, res, schema: Schema.project.post });
  if (errorHandled) return;
  
  const query = {id:req.user.id};
  
  // check for existing project
  try {
    const user = await em.findOne(User, query);
    if (user?.project!==undefined) {
      res.status(409);
      return;
    }
  }
  catch {
    res.status(500);
    return;
  }
  try {
    const project = new Project(data);
    em.persistAndFlush(project);
    res.send(project);
  }
  catch(err) {
    logger.error(err);
    res.send(500);
  }
};

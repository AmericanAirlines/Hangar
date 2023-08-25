import { Schema } from '@hangar/shared';
import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { validatePayload } from '../../utils/validatePayload';
import { Project, User } from '@hangar/database';
import { DriverException, LockMode } from '@mikro-orm/core';

export const post = async (req: Request, res: Response) => {
  const { entityManager } = req;
  const data = req.body;

  // const { errorHandled, data } = validatePayload({ req, res, schema: Schema.project.post });
  // if (errorHandled) return;
  
  await entityManager.transactional( async em => {
    let user: User;
    const lockMode = { lockMode: LockMode.PESSIMISTIC_WRITE_OR_FAIL };
    try {
      user = await em.findOneOrFail(User, {id:req?.user?.id||'3'}, lockMode);
    }
    catch (err) {
      if ((err as DriverException).code === '55P03') {
        // Locking error  
        res.sendStatus(423)
      }
      else {
        // console.log(err)
        res.sendStatus(500)
      }
      return
    }
    
    const project = new Project(data);
    
    // Check to make sure a project STILL does not exist
    if (user?.project) {
      res.sendStatus(409)
      return
    }
    user.project = project.toReference()
    em.persist([ user, project ]);
  })

  res.sendStatus(200)
};

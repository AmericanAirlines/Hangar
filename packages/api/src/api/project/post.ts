import { Schema } from '@hangar/shared';
import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { validatePayload } from '../../utils/validatePayload';
import { Project, User } from '@hangar/database';
import { DriverException, LockMode } from '@mikro-orm/core';

export const post = async (req: Request, res: Response) => {
  const { entityManager: em } = req;
  const data = req.body;

  // const { errorHandled, data } = validatePayload({ req, res, schema: Schema.project.post });
  // if (errorHandled) return;
  
  // const query = {id:req.user.id};
  // check for existing project

  // try catch at the highest level

  await em.transactional(async em => {
    
    let user: User;
    try {
      user = await em.findOneOrFail(User, { id: '3' }, { lockMode: LockMode.PESSIMISTIC_WRITE_OR_FAIL }); // req.user )
    }
    catch (err) {
      if ((err as DriverException).code === '55P03') {
        res.send('423')
      }
      res.send(500)
      return
    }
    
    const project = new Project(data);
    
    if (user?.project) {
      res.send('409')
      return
    }
    user.project = project.toReference()
    
    try {
      em.persist([ user, project ]);
      await em.flush();
    }
    catch {
      res.send('500')
    }
    
  })
  

};

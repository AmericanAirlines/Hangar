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
  if (req.user?.project) {
    // res.status(409);
    // return;
  }

  await em.transactional(async em => {
    
    let user
    try {
      user = await em.findOne( User , { id:'3' })//req.user )
    }
    catch {
      res.send(500)
    }
    
    if (user) {
      try {
        await em.lock( user, LockMode.PESSIMISTIC_WRITE_OR_FAIL );
      }
      catch(err) {
        if ((err as DriverException).code === '55P03') {
          res.send('423')
          return
        }
        console.log(err)
      }
      const project = new Project(data);
      
      if (user?.project) {
        res.send('409')
        return
      }
      user.project = project.toReference()
      
      try {
        await em.persist([ user, project ]);
        await em.flush();
      }
      catch {
        res.send('500')
      }
    }
    
  })
  

};

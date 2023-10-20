/* eslint-disable class-methods-use-this */
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { ProjectFactory } from '../factories/ProjectFactory';
import { Judge, Project, User } from '../../src';

const random = (seed:number) => ( function(seed) {
  return () => {
      var n = Math.sin(seed++);
      return n - Math.floor(n)
  };
})(seed);

export class ProjectSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    const projectFactory = new ProjectFactory(em);

    try {
      const judges = await em.find(Judge, {});
      const usersNotJudgesQuery = {
        id : {
          $nin : !judges.length ? [] : judges.map( judge => judge.user.id )
        }
      };
      const availableUsers:User[] = await em.find(User, usersNotJudgesQuery);
      
      // one project for every 3 non-judge users, leaving some non-judge users without a project also
      const projects = projectFactory.make(Math.floor((availableUsers.length-2)/3));

      const rng = function(fn) {
        const lowerBound = 0;
        const upperBound = projects.length+1;
        return () => Math.floor( fn()*upperBound ) + lowerBound
      }(random(1));

      // assign some non-judge users a project
      availableUsers.forEach( (user) => {
        const project = projects[rng()];
        // some users will not have a project
        if (!project)return;
        
        user.project = project.toReference();
        em.persist(user);
      });
      
      
    } catch(e) {
      // eslint-disable-next-line no-console
      console.error('Failed to create additional judges');
    }
  };
}

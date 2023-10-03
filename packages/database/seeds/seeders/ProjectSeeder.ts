/* eslint-disable class-methods-use-this */
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { ProjectFactory } from '../factories/ProjectFactory';

const projectsToMake = 20;

export class ProjectSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    const projectFactory = new ProjectFactory(em);

    em.persist(projectFactory.make(projectsToMake));
  };
}

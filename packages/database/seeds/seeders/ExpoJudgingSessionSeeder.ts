/* eslint-disable class-methods-use-this */
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { env } from '../env';
import { ExpoJudgingSession, Project, User } from '../../src';

export class ExpoJudgingSessionSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    if (env.primaryUserIsAdmin) {
      try {
        const admin = await em.findOneOrFail(User, { id: '1' });
        const expoJudgingSession = new ExpoJudgingSession({
          createdBy: admin.toReference(),
        });
        const projects = await em.find(Project, {});
        expoJudgingSession.projects.set(projects);

        em.persist(expoJudgingSession);
      } catch {
        // eslint-disable-next-line no-console
        console.error('Failed to create judge for primary user');
      }
    }
  };
}
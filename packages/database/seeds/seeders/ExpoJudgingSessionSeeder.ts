/* eslint-disable class-methods-use-this */
import { EntityManager, ref } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { env } from '../env';
import { ExpoJudgingSession, Project, User } from '../../src';

const numSessions = 2;

export class ExpoJudgingSessionSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    if (env.primaryUserIsAdmin) {
      try {
<<<<<<< Updated upstream
        const projects = await em.find(Project, {});
        const admin = await em.findOneOrFail(User, { id: '1' });

        for (let i = 0; i < numSessions; i += 1) {
          const expoJudgingSession = new ExpoJudgingSession({
            createdBy: ref(admin),
            title: `Expo Judging Session ${i + 1}`,
          });
          expoJudgingSession.projects.set(projects);

=======
        for(let i=0;i<2;i=i+1){
          const admin = await em.findOneOrFail(User, { id: '1' });
          const expoJudgingSession = new ExpoJudgingSession({
            createdBy: ref(admin),
          });
          const projects = await em.find(Project, {});
          expoJudgingSession.projects.set(projects);

>>>>>>> Stashed changes
          em.persist(expoJudgingSession);
        }
      } catch {
        // eslint-disable-next-line no-console
        console.error('Failed to create a judging session');
      }
    }
  };
}

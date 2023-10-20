import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { env } from '../env';
import { ExpoJudgingSession, ExpoJudgingSessionContext, Judge } from '../../src';

export class ExpoJudgingSessionContextSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    if (env.primaryUserIsAdmin) {
      try {
        // non primary user judges
        const judges = await em.find(Judge, {id:{$ne:'1'}});
        const expoJudgingSession:ExpoJudgingSession[] = await em.find(ExpoJudgingSession, {});

        judges.forEach( async (judge) => {
          
          if (!expoJudgingSession[0]) return;
          
          judge.expoJudgingSessionContexts.add(
            new ExpoJudgingSessionContext({
              judge: judge.toReference(),
              expoJudgingSession: expoJudgingSession[0].toReference(),
            }),
          );
          await em.populate(judge, ['expoJudgingSessionContexts']);
          
          em.persist(judge);
        });
      } catch {
        // eslint-disable-next-line no-console
        console.error('aFailed to create judge for primary user');
      }
    }
  };
}

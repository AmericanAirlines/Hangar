/* eslint-disable class-methods-use-this */
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { env } from '../env';
import { ExpoJudgingSession, ExpoJudgingSessionContext, Judge } from '../../src';

export class ExpoJudgingSessionContextSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    if (env.primaryUserIsAdmin) {
      try {
        // non primary user judges
        const judges = await em.find(Judge, env.primaryUserIsJudge ? { id: { $ne: '1' } } : {});
        const expoJudgingSession: ExpoJudgingSession = await em.findOneOrFail(ExpoJudgingSession, {
          id: '1',
        });

        judges.forEach((judge) => {
          judge.expoJudgingSessionContexts.add(
            new ExpoJudgingSessionContext({
              judge: judge.toReference(),
              expoJudgingSession: expoJudgingSession.toReference(),
            }),
          );

          em.persist(judge);
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to create judge for primary user', error);
      }
    }
  };
}

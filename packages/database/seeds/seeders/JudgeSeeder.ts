/* eslint-disable class-methods-use-this */
import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { env } from '../env';
import { Judge, User } from '../../src';

const judgesToMake = 20;
export class JudgeSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    if (env.primaryUserIsAdmin) {
      try {
        const initialUser = await em.findOneOrFail(User, { id: '1' });
        const judge = new Judge({ user: initialUser.toReference() });
        em.persist(judge);
      } catch {
        // eslint-disable-next-line no-console
      }
    }
    try {
      // find all other users
      const users = await em.find(User, env.primaryUserIsJudge ? { id: { $ne: '1' } } : {});
      const numJudgesToMake = Math.min(judgesToMake, users.length - 1);
      for (let i = 0; i < numJudgesToMake; i += 1) {
        const user = users[i] as User;
        // User was NOT used already

        const judge = new Judge({ user: user.toReference() });

        em.persist(judge);
      }
      await em.flush();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e, 'Failed to create additional judges');
    }
  };
}

/* eslint-disable class-methods-use-this */
import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { env } from '../env';
import { Judge, User } from '../../src';

const judgesToMake = 5;
export class JudgeSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    if (env.primaryUserIsAdmin) {
      try {
        const initialUser = await em.findOneOrFail(User, { id: '1' });
        const judge = new Judge({ user: initialUser.toReference() });
        em.persist(judge);
      } catch {
        // eslint-disable-next-line no-console
        console.error('Failed to create judge for primary user');
      }
    }
    try {
      // find all other users
      const users = await em.find(User, { id: { $ne: '1' } });
      // create a judge for some users, ensure the judges are fewer
      // than all users minus the primary user and one base user
      let numJudgesToMake = Math.min(judgesToMake, users.length - 1);
      let usedUsers = ['1'];
      while (makeJudges > 0) {
        const user = users[Math.floor(Math.random() * users.length)];

        if (!(!user || usedUsers.indexOf(user.id) > -1)) {
          usedUsers = [...usedUsers, user.id];

          const judge = new Judge({ user: user.toReference() });

          em.persist(judge);
          makeJudges -= 1;
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e, 'Failed to create additional judges');
    }
  };
}

/* eslint-disable class-methods-use-this */
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { env } from '../env';
import { Judge, User } from '../../src';

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
  };
}

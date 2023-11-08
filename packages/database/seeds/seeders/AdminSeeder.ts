/* eslint-disable class-methods-use-this */
import { EntityManager, ref } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { env } from '../env';
import { Admin, User } from '../../src';

export class AdminSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    if (env.primaryUserIsAdmin) {
      try {
        const initialUser = await em.findOneOrFail(User, { id: '1' });
        const admin = new Admin({ user: ref(initialUser) });
        em.persist(admin);
      } catch {
        // eslint-disable-next-line no-console
        console.error('Failed to create admin for primary user');
      }
    }
  };
}

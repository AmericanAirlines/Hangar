/* eslint-disable class-methods-use-this */
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { env } from '../env';
import { User } from '../../src';

export class UserSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    if (env.primaryUserEmail) {
      // Primary user email was provided;
      const user = new User({
        firstName: env.primaryUserFirstName ?? 'Jane',
        lastName: env.primaryUserLastName ?? 'Doe',
        email: env.primaryUserEmail,
      });
      em.persist(user);
    }
  };
}

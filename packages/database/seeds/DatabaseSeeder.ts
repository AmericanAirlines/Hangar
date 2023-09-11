import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserSeeder } from './seeders/UserSeeder';
import { AdminSeeder } from './seeders/AdminSeeder';
import { EventSeeder } from './seeders/EventSeeder';
import { PrizeSeeder } from './seeders/PrizeSeeder';

export class DatabaseSeeder extends Seeder {
  run = async (em: EntityManager): Promise<any> =>
    this.call(em, [UserSeeder, AdminSeeder, EventSeeder, PrizeSeeder]);
}

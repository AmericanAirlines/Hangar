import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';

export class DatabaseSeeder extends Seeder {
  run = async (em: EntityManager): Promise<any> => this.call(em, []);
}

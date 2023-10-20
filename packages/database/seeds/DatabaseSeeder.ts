import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserSeeder } from './seeders/UserSeeder';
import { AdminSeeder } from './seeders/AdminSeeder';
import { EventSeeder } from './seeders/EventSeeder';
import { PrizeSeeder } from './seeders/PrizeSeeder';
import { JudgeSeeder } from './seeders/JudgeSeeder';
import { ProjectSeeder } from './seeders/ProjectSeeder';
import { ExpoJudgingSessionSeeder } from './seeders/ExpoJudgingSessionSeeder';
import { ExpoJudgingVoteSeeder } from './seeders/ExpoJudgingVoteSeeder';
import { ExpoJudgingSessionContextSeeder } from './seeders/ExpoJudgingSessionContextSeeder';

export class DatabaseSeeder extends Seeder {
  run = async (em: EntityManager): Promise<any> =>
    this.call(em, [
      UserSeeder,
      AdminSeeder,
      ProjectSeeder,
      ExpoJudgingSessionSeeder,
      JudgeSeeder,
      ExpoJudgingSessionContextSeeder,
      ExpoJudgingVoteSeeder,
      EventSeeder,
      PrizeSeeder,
    ]);
}

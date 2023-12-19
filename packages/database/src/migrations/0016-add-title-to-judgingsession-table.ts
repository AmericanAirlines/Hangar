import { Migration } from '@mikro-orm/migrations';

export class Migration20231218190523 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "ExpoJudgingSession" add column "title" text not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "ExpoJudgingSession" drop column "title";');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20231020214310 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "CriteriaJudgingSession" add column "title" text not null, add column "description" text not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "CriteriaJudgingSession" drop column "title";');
    this.addSql('alter table "CriteriaJudgingSession" drop column "description";');
  }

}

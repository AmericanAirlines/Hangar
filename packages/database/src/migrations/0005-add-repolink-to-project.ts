import { Migration } from '@mikro-orm/migrations';

export class Migration20230908202438 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Project" add column "repoLink" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Project" drop column "repoLink";');
  }

}

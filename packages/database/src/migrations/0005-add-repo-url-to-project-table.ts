import { Migration } from '@mikro-orm/migrations';

export class Migration20230912194234 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Project" add column "repoUrl" text not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Project" drop column "repoUrl";');
  }

}

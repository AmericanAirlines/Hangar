import { Migration } from '@mikro-orm/migrations';

export class Migration20230911214255 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Project" add column "repoUrl" text not null;');
    this.addSql('alter table "Project" drop column "repoLink";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Project" add column "repoLink" text null;');
    this.addSql('alter table "Project" drop column "repoUrl";');
  }

}

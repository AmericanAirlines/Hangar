import { Migration } from '@mikro-orm/migrations';

export class Migration20231128230604 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Project" drop column "judgeVisits";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Project" add column "judgeVisits" int not null;');
  }

}

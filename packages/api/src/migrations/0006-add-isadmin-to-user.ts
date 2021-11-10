import { Migration } from '@mikro-orm/migrations';

export class Migration20211104184422 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" add column "isAdmin" bool not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "isAdmin";');
  }
}

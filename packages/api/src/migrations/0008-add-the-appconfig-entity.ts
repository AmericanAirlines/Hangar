import { Migration } from '@mikro-orm/migrations';

export class Migration20211111220728 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "app-config" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "key" text not null, "value" jsonb null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table "app-config";');
  }
}

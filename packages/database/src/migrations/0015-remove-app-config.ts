import { Migration } from '@mikro-orm/migrations';

export class Migration20231215144720 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "AppConfig" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "AppConfig" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "key" text not null, "value" jsonb null);');
    this.addSql('alter table "AppConfig" add constraint "AppConfig_key_unique" unique ("key");');
  }

}

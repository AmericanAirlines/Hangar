import { Migration } from '@mikro-orm/migrations';

export class Migration20211112172734 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "app-config" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "key" text not null, "value" jsonb null);');
    this.addSql('alter table "app-config" add constraint "app-config_key_unique" unique ("key");');
  }

  async down(): Promise<void> {
    this.addSql('drop table "app-config";');
  }
}

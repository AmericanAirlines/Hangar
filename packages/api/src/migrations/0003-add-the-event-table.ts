import { Migration } from '@mikro-orm/migrations';

export class Migration20211021175229 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "event" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "name" text not null, "start" timestamptz not null, "end" timestamptz not null, "description" text null);');
  }
  
  async down(): Promise<void> {
    this.addSql('drop table "event";');
  }
}

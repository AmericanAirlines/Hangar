import { Migration } from '@mikro-orm/migrations';

export class Migration20211021180537 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "prize" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "name" text not null, "sortOrder" int not null, "description" text null, "isBonus" boolean not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table "prize";');
  }
}

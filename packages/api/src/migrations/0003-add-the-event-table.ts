import { Migration } from '@mikro-orm/migrations';

export class Migration20211021161806 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "event" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "name" text not null, "start" date not null, "end" date not null, "description" text null);');
  }

}

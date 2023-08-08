import { Migration } from '@mikro-orm/migrations';

export class Migration20230808000156 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "User" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "firstName" text not null, "lastName" text not null, "email" text not null);');
    this.addSql('alter table "User" add constraint "User_email_unique" unique ("email");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "User" cascade;');
  }

}

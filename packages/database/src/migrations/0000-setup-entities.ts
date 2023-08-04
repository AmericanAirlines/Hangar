import { Migration } from '@mikro-orm/migrations';

export class Migration20230803175608 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "AppConfig" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "key" text not null, "value" jsonb null);');
    this.addSql('alter table "AppConfig" add constraint "AppConfig_key_unique" unique ("key");');

    this.addSql('create table "Event" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "name" text not null, "start" timestamptz not null, "end" timestamptz not null, "description" text null);');

    this.addSql('create table "Prize" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "name" text not null, "sortOrder" int not null, "description" text null, "isBonus" boolean not null);');

    this.addSql('create table "User" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "authId" text not null, "name" text not null, "subscribed" boolean not null, "email" text null, "metadata" jsonb null, "isAdmin" boolean not null default false);');
    this.addSql('alter table "User" add constraint "User_authId_unique" unique ("authId");');

    this.addSql('create table "Project" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "name" text not null, "description" text not null, "location" text null, "user" bigint not null);');
    this.addSql('alter table "Project" add constraint "Project_location_unique" unique ("location");');
    this.addSql('alter table "Project" add constraint "Project_user_unique" unique ("user");');

    this.addSql('alter table "Project" add constraint "Project_user_foreign" foreign key ("user") references "User" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Project" drop constraint "Project_user_foreign";');

    this.addSql('drop table if exists "AppConfig" cascade;');

    this.addSql('drop table if exists "Event" cascade;');

    this.addSql('drop table if exists "Prize" cascade;');

    this.addSql('drop table if exists "User" cascade;');

    this.addSql('drop table if exists "Project" cascade;');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20211021165204 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "video" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "title" text not null, "durationInSeconds" int not null, "url" text not null);');

    this.addSql('create table "user" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "name" text not null, "pronouns" text null, "location" text null, "hireable" boolean not null, "purpose" text not null, "schoolName" text null, "major" text null, "graduationDate" Date null);');

    this.addSql('create table "prize" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "name" text not null, "sortOrder" int not null, "description" text null, "isBonus" boolean not null);');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20230808214934 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "AppConfig" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "key" text not null, "value" jsonb null);');
    this.addSql('alter table "AppConfig" add constraint "AppConfig_key_unique" unique ("key");');

    this.addSql('create table "Event" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "name" text not null, "start" timestamptz not null, "end" timestamptz not null, "description" text null);');

    this.addSql('create table "JudgingVote" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "previousProject" varchar(255) not null, "currentProject" varchar(255) not null, "currentProjectChosen" boolean not null);');

    this.addSql('create table "Prize" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "name" text not null, "position" int not null, "description" text null, "isBonus" boolean not null);');
    this.addSql('alter table "Prize" add constraint "Prize_position_unique" unique ("position");');

    this.addSql('create table "Project" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "name" text not null, "description" text not null, "location" text null, "judgeVisits" int not null, "activeJudgeCount" int not null);');
    this.addSql('alter table "Project" add constraint "Project_location_unique" unique ("location");');

    this.addSql('create table "User" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "firstName" text not null, "lastName" text not null, "project" bigint null);');

    this.addSql('create table "Judge" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "user" bigint not null, "currentProject" bigint null, "previousProject" bigint null);');
    this.addSql('alter table "Judge" add constraint "Judge_user_unique" unique ("user");');
    this.addSql('alter table "Judge" add constraint "Judge_currentProject_unique" unique ("currentProject");');
    this.addSql('alter table "Judge" add constraint "Judge_previousProject_unique" unique ("previousProject");');

    this.addSql('create table "Judge_visitedProjects" ("judge" bigint not null, "project" bigint not null, constraint "Judge_visitedProjects_pkey" primary key ("judge", "project"));');

    this.addSql('alter table "User" add constraint "User_project_foreign" foreign key ("project") references "Project" ("id") on update cascade on delete set null;');

    this.addSql('alter table "Judge" add constraint "Judge_user_foreign" foreign key ("user") references "User" ("id") on update cascade;');
    this.addSql('alter table "Judge" add constraint "Judge_currentProject_foreign" foreign key ("currentProject") references "Project" ("id") on update cascade on delete set null;');
    this.addSql('alter table "Judge" add constraint "Judge_previousProject_foreign" foreign key ("previousProject") references "Project" ("id") on update cascade on delete set null;');

    this.addSql('alter table "Judge_visitedProjects" add constraint "Judge_visitedProjects_judge_foreign" foreign key ("judge") references "Judge" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "Judge_visitedProjects" add constraint "Judge_visitedProjects_project_foreign" foreign key ("project") references "Project" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "User" drop constraint "User_project_foreign";');

    this.addSql('alter table "Judge" drop constraint "Judge_currentProject_foreign";');

    this.addSql('alter table "Judge" drop constraint "Judge_previousProject_foreign";');

    this.addSql('alter table "Judge_visitedProjects" drop constraint "Judge_visitedProjects_project_foreign";');

    this.addSql('alter table "Judge" drop constraint "Judge_user_foreign";');

    this.addSql('alter table "Judge_visitedProjects" drop constraint "Judge_visitedProjects_judge_foreign";');

    this.addSql('drop table if exists "AppConfig" cascade;');

    this.addSql('drop table if exists "Event" cascade;');

    this.addSql('drop table if exists "JudgingVote" cascade;');

    this.addSql('drop table if exists "Prize" cascade;');

    this.addSql('drop table if exists "Project" cascade;');

    this.addSql('drop table if exists "User" cascade;');

    this.addSql('drop table if exists "Judge" cascade;');

    this.addSql('drop table if exists "Judge_visitedProjects" cascade;');
  }

}

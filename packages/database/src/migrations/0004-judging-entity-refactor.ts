import { Migration } from '@mikro-orm/migrations';

export class Migration20230906190129 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "ExpoJudgingSession" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "inviteCode" varchar(255) not null, "createdBy" bigint not null);');
    this.addSql('alter table "ExpoJudgingSession" add constraint "ExpoJudgingSession_inviteCode_unique" unique ("inviteCode");');

    this.addSql('create table "Judge_expoJudgingSessions" ("judge" bigint not null, "expoJudgingSession" bigint not null, constraint "Judge_expoJudgingSessions_pkey" primary key ("judge", "expoJudgingSession"));');

    this.addSql('create table "ExpoJudgingVote" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "judge" bigint not null, "previousProject" bigint not null, "currentProject" bigint not null, "currentProjectChosen" boolean not null, "judgingSession" bigint not null);');

    this.addSql('alter table "ExpoJudgingSession" add constraint "ExpoJudgingSession_createdBy_foreign" foreign key ("createdBy") references "User" ("id") on update cascade;');

    this.addSql('alter table "Judge_expoJudgingSessions" add constraint "Judge_expoJudgingSessions_judge_foreign" foreign key ("judge") references "Judge" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "Judge_expoJudgingSessions" add constraint "Judge_expoJudgingSessions_expoJudgingSession_foreign" foreign key ("expoJudgingSession") references "ExpoJudgingSession" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "ExpoJudgingVote" add constraint "ExpoJudgingVote_judge_foreign" foreign key ("judge") references "Judge" ("id") on update cascade;');
    this.addSql('alter table "ExpoJudgingVote" add constraint "ExpoJudgingVote_previousProject_foreign" foreign key ("previousProject") references "Project" ("id") on update cascade;');
    this.addSql('alter table "ExpoJudgingVote" add constraint "ExpoJudgingVote_currentProject_foreign" foreign key ("currentProject") references "Project" ("id") on update cascade;');
    this.addSql('alter table "ExpoJudgingVote" add constraint "ExpoJudgingVote_judgingSession_foreign" foreign key ("judgingSession") references "ExpoJudgingSession" ("id") on update cascade;');

    this.addSql('drop table if exists "JudgingVote" cascade;');

    this.addSql('drop table if exists "Judge_visitedProjects" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Judge_expoJudgingSessions" drop constraint "Judge_expoJudgingSessions_expoJudgingSession_foreign";');

    this.addSql('alter table "ExpoJudgingVote" drop constraint "ExpoJudgingVote_judgingSession_foreign";');

    this.addSql('create table "JudgingVote" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "previousProject" bigint not null, "currentProject" bigint not null, "currentProjectChosen" boolean not null);');

    this.addSql('create table "Judge_visitedProjects" ("judge" bigint not null, "project" bigint not null, constraint "Judge_visitedProjects_pkey" primary key ("judge", "project"));');

    this.addSql('alter table "JudgingVote" add constraint "JudgingVote_previousProject_foreign" foreign key ("previousProject") references "Project" ("id") on update cascade;');
    this.addSql('alter table "JudgingVote" add constraint "JudgingVote_currentProject_foreign" foreign key ("currentProject") references "Project" ("id") on update cascade;');

    this.addSql('alter table "Judge_visitedProjects" add constraint "Judge_visitedProjects_judge_foreign" foreign key ("judge") references "Judge" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "Judge_visitedProjects" add constraint "Judge_visitedProjects_project_foreign" foreign key ("project") references "Project" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "ExpoJudgingSession" cascade;');

    this.addSql('drop table if exists "Judge_expoJudgingSessions" cascade;');

    this.addSql('drop table if exists "ExpoJudgingVote" cascade;');
  }

}

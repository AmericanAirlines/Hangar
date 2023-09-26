import { Migration } from '@mikro-orm/migrations';

export class Migration20230926015657 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "ExpoJudgingSessionContext" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "judge" bigint not null, "expoJudgingSession" bigint not null, "currentProject" bigint null, "previousProject" bigint null);');
    this.addSql('alter table "ExpoJudgingSessionContext" add constraint "ExpoJudgingSessionContext_judge_expoJudgingSession_unique" unique ("judge", "expoJudgingSession");');

    this.addSql('create table "Judge_expoJudgingSessionContexts" ("judge" bigint not null, "expoJudgingSessionContext" bigint not null, constraint "Judge_expoJudgingSessionContexts_pkey" primary key ("judge", "expoJudgingSessionContext"));');

    this.addSql('create table "ExpoJudgingSession_projects" ("expoJudgingSession" bigint not null, "project" bigint not null, constraint "ExpoJudgingSession_projects_pkey" primary key ("expoJudgingSession", "project"));');

    this.addSql('alter table "ExpoJudgingSessionContext" add constraint "ExpoJudgingSessionContext_judge_foreign" foreign key ("judge") references "Judge" ("id") on update cascade;');
    this.addSql('alter table "ExpoJudgingSessionContext" add constraint "ExpoJudgingSessionContext_expoJudgingSession_foreign" foreign key ("expoJudgingSession") references "ExpoJudgingSession" ("id") on update cascade;');
    this.addSql('alter table "ExpoJudgingSessionContext" add constraint "ExpoJudgingSessionContext_currentProject_foreign" foreign key ("currentProject") references "Project" ("id") on update cascade on delete set null;');
    this.addSql('alter table "ExpoJudgingSessionContext" add constraint "ExpoJudgingSessionContext_previousProject_foreign" foreign key ("previousProject") references "Project" ("id") on update cascade on delete set null;');

    this.addSql('alter table "Judge_expoJudgingSessionContexts" add constraint "Judge_expoJudgingSessionContexts_judge_foreign" foreign key ("judge") references "Judge" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "Judge_expoJudgingSessionContexts" add constraint "Judge_expoJudgingSessionContexts_expoJudgingSessi_dd190_foreign" foreign key ("expoJudgingSessionContext") references "ExpoJudgingSessionContext" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "ExpoJudgingSession_projects" add constraint "ExpoJudgingSession_projects_expoJudgingSession_foreign" foreign key ("expoJudgingSession") references "ExpoJudgingSession" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "ExpoJudgingSession_projects" add constraint "ExpoJudgingSession_projects_project_foreign" foreign key ("project") references "Project" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "Judge_expoJudgingSessions" cascade;');

    this.addSql('alter table "Judge" drop constraint "Judge_currentProject_foreign";');
    this.addSql('alter table "Judge" drop constraint "Judge_previousProject_foreign";');

    this.addSql('alter table "Judge" drop constraint "Judge_currentProject_unique";');
    this.addSql('alter table "Judge" drop constraint "Judge_previousProject_unique";');
    this.addSql('alter table "Judge" drop column "currentProject";');
    this.addSql('alter table "Judge" drop column "previousProject";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Judge_expoJudgingSessionContexts" drop constraint "Judge_expoJudgingSessionContexts_expoJudgingSessi_dd190_foreign";');

    this.addSql('create table "Judge_expoJudgingSessions" ("judge" bigint not null, "expoJudgingSession" bigint not null, constraint "Judge_expoJudgingSessions_pkey" primary key ("judge", "expoJudgingSession"));');

    this.addSql('alter table "Judge_expoJudgingSessions" add constraint "Judge_expoJudgingSessions_judge_foreign" foreign key ("judge") references "Judge" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "Judge_expoJudgingSessions" add constraint "Judge_expoJudgingSessions_expoJudgingSession_foreign" foreign key ("expoJudgingSession") references "ExpoJudgingSession" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "ExpoJudgingSessionContext" cascade;');

    this.addSql('drop table if exists "Judge_expoJudgingSessionContexts" cascade;');

    this.addSql('drop table if exists "ExpoJudgingSession_projects" cascade;');

    this.addSql('alter table "Judge" add column "currentProject" bigint null, add column "previousProject" bigint null;');
    this.addSql('alter table "Judge" add constraint "Judge_currentProject_foreign" foreign key ("currentProject") references "Project" ("id") on update cascade on delete set null;');
    this.addSql('alter table "Judge" add constraint "Judge_previousProject_foreign" foreign key ("previousProject") references "Project" ("id") on update cascade on delete set null;');
    this.addSql('alter table "Judge" add constraint "Judge_currentProject_unique" unique ("currentProject");');
    this.addSql('alter table "Judge" add constraint "Judge_previousProject_unique" unique ("previousProject");');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20231018233643 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "Criteria" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "title" text not null, "description" text not null, "weight" int not null, "scaleMin" int not null, "scaleMax" int not null, "scaleDescription" text not null);');

    this.addSql('create table "CriteriaJudgingSession" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "inviteCode" varchar(255) not null, "createdBy" bigint not null);');
    this.addSql('alter table "CriteriaJudgingSession" add constraint "CriteriaJudgingSession_inviteCode_unique" unique ("inviteCode");');

    this.addSql('create table "CriteriaJudgingSubmission" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "judge" bigint not null, "criteriaJudgingSession" bigint not null, "project" bigint not null);');
    this.addSql('alter table "CriteriaJudgingSubmission" add constraint "CriteriaJudgingSubmission_judge_criteriaJudgingSes_95c60_unique" unique ("judge", "criteriaJudgingSession", "project");');

    this.addSql('create table "CriteriaScore" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "submission" bigint not null, "criteria" bigint not null, "score" int not null);');
    this.addSql('alter table "CriteriaScore" add constraint "CriteriaScore_submission_criteria_unique" unique ("submission", "criteria");');

    this.addSql('create table "CriteriaJudgingSession_projects" ("criteriaJudgingSession" bigint not null, "project" bigint not null, constraint "CriteriaJudgingSession_projects_pkey" primary key ("criteriaJudgingSession", "project"));');

    this.addSql('create table "CriteriaJudgingSession_criteriaList" ("criteriaJudgingSession" bigint not null, "criteria" bigint not null, constraint "CriteriaJudgingSession_criteriaList_pkey" primary key ("criteriaJudgingSession", "criteria"));');

    this.addSql('alter table "CriteriaJudgingSession" add constraint "CriteriaJudgingSession_createdBy_foreign" foreign key ("createdBy") references "User" ("id") on update cascade;');

    this.addSql('alter table "CriteriaJudgingSubmission" add constraint "CriteriaJudgingSubmission_judge_foreign" foreign key ("judge") references "Judge" ("id") on update cascade;');
    this.addSql('alter table "CriteriaJudgingSubmission" add constraint "CriteriaJudgingSubmission_criteriaJudgingSession_foreign" foreign key ("criteriaJudgingSession") references "CriteriaJudgingSession" ("id") on update cascade;');
    this.addSql('alter table "CriteriaJudgingSubmission" add constraint "CriteriaJudgingSubmission_project_foreign" foreign key ("project") references "Project" ("id") on update cascade;');

    this.addSql('alter table "CriteriaScore" add constraint "CriteriaScore_submission_foreign" foreign key ("submission") references "CriteriaJudgingSubmission" ("id") on update cascade;');
    this.addSql('alter table "CriteriaScore" add constraint "CriteriaScore_criteria_foreign" foreign key ("criteria") references "Criteria" ("id") on update cascade;');

    this.addSql('alter table "CriteriaJudgingSession_projects" add constraint "CriteriaJudgingSession_projects_criteriaJudgingSession_foreign" foreign key ("criteriaJudgingSession") references "CriteriaJudgingSession" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "CriteriaJudgingSession_projects" add constraint "CriteriaJudgingSession_projects_project_foreign" foreign key ("project") references "Project" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "CriteriaJudgingSession_criteriaList" add constraint "CriteriaJudgingSession_criteriaList_criteriaJudgi_f06ac_foreign" foreign key ("criteriaJudgingSession") references "CriteriaJudgingSession" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "CriteriaJudgingSession_criteriaList" add constraint "CriteriaJudgingSession_criteriaList_criteria_foreign" foreign key ("criteria") references "Criteria" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "CriteriaScore" drop constraint "CriteriaScore_criteria_foreign";');

    this.addSql('alter table "CriteriaJudgingSession_criteriaList" drop constraint "CriteriaJudgingSession_criteriaList_criteria_foreign";');

    this.addSql('alter table "CriteriaJudgingSubmission" drop constraint "CriteriaJudgingSubmission_criteriaJudgingSession_foreign";');

    this.addSql('alter table "CriteriaJudgingSession_projects" drop constraint "CriteriaJudgingSession_projects_criteriaJudgingSession_foreign";');

    this.addSql('alter table "CriteriaJudgingSession_criteriaList" drop constraint "CriteriaJudgingSession_criteriaList_criteriaJudgi_f06ac_foreign";');

    this.addSql('alter table "CriteriaScore" drop constraint "CriteriaScore_submission_foreign";');

    this.addSql('drop table if exists "Criteria" cascade;');

    this.addSql('drop table if exists "CriteriaJudgingSession" cascade;');

    this.addSql('drop table if exists "CriteriaJudgingSubmission" cascade;');

    this.addSql('drop table if exists "CriteriaScore" cascade;');

    this.addSql('drop table if exists "CriteriaJudgingSession_projects" cascade;');

    this.addSql('drop table if exists "CriteriaJudgingSession_criteriaList" cascade;');
  }

}

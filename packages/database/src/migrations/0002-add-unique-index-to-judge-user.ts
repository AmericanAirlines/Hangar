import { Migration } from '@mikro-orm/migrations';

export class Migration20230824221813 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "JudgingVote" alter column "previousProject" type bigint using ("previousProject"::bigint);');
    this.addSql('alter table "JudgingVote" alter column "currentProject" type bigint using ("currentProject"::bigint);');
    this.addSql('alter table "JudgingVote" add constraint "JudgingVote_previousProject_foreign" foreign key ("previousProject") references "Project" ("id") on update cascade;');
    this.addSql('alter table "JudgingVote" add constraint "JudgingVote_currentProject_foreign" foreign key ("currentProject") references "Project" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "JudgingVote" drop constraint "JudgingVote_previousProject_foreign";');
    this.addSql('alter table "JudgingVote" drop constraint "JudgingVote_currentProject_foreign";');

    this.addSql('alter table "JudgingVote" alter column "previousProject" type varchar(255) using ("previousProject"::varchar(255));');
    this.addSql('alter table "JudgingVote" alter column "currentProject" type varchar(255) using ("currentProject"::varchar(255));');
  }

}

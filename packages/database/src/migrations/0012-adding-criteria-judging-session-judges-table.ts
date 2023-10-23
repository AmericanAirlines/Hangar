import { Migration } from '@mikro-orm/migrations';

export class Migration20231023184711 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "Judge_criteriaJudgingSessions" ("judge" bigint not null, "criteriaJudgingSession" bigint not null, constraint "Judge_criteriaJudgingSessions_pkey" primary key ("judge", "criteriaJudgingSession"));');

    this.addSql('alter table "Judge_criteriaJudgingSessions" add constraint "Judge_criteriaJudgingSessions_judge_foreign" foreign key ("judge") references "Judge" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "Judge_criteriaJudgingSessions" add constraint "Judge_criteriaJudgingSessions_criteriaJudgingSession_foreign" foreign key ("criteriaJudgingSession") references "CriteriaJudgingSession" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "Judge_criteriaJudgingSessions" cascade;');
  }

}

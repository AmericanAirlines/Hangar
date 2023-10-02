import { Migration } from '@mikro-orm/migrations';

export class Migration20231002213723 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "Judge_expoJudgingSessionContexts" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "Judge_expoJudgingSessionContexts" ("judge" bigint not null, "expoJudgingSessionContext" bigint not null, constraint "Judge_expoJudgingSessionContexts_pkey" primary key ("judge", "expoJudgingSessionContext"));');

    this.addSql('alter table "Judge_expoJudgingSessionContexts" add constraint "Judge_expoJudgingSessionContexts_judge_foreign" foreign key ("judge") references "Judge" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "Judge_expoJudgingSessionContexts" add constraint "Judge_expoJudgingSessionContexts_expoJudgingSessi_dd190_foreign" foreign key ("expoJudgingSessionContext") references "ExpoJudgingSessionContext" ("id") on update cascade on delete cascade;');
  }

}

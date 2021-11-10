import { Migration } from '@mikro-orm/migrations';

export class Migration20211110195415 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "queue-user" add column "assignee" bigint null;');

    this.addSql('alter table "queue-user" add constraint "queue-user_assignee_foreign" foreign key ("assignee") references "user" ("id") on update cascade on delete set null;');
  }

}

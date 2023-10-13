import { Migration } from '@mikro-orm/migrations';

export class Migration20231013152153 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Prize" add column "winner" bigint null;');
    this.addSql('alter table "Prize" add constraint "Prize_winner_foreign" foreign key ("winner") references "Project" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Prize" drop constraint "Prize_winner_foreign";');

    this.addSql('alter table "Prize" drop column "winner";');
  }

}

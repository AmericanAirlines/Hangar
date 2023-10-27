import { Migration } from '@mikro-orm/migrations';

export class Migration20231026154301 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Criteria" alter column "weight" type decimal using ("weight"::decimal);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Criteria" alter column "weight" type int using ("weight"::int);');
  }

}

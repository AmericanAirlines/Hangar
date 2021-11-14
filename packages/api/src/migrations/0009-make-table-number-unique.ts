import { Migration } from '@mikro-orm/migrations';

export class Migration20211114160141 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "project" add constraint "project_tableNumber_unique" unique ("tableNumber");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" drop constraint "project_tableNumber_unique";');
  }
}

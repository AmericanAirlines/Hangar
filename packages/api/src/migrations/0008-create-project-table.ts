import { Migration } from '@mikro-orm/migrations';

export class Migration20211112224551 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "project" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "name" text not null, "description" text not null, "tableNumber" text null, "user" bigint not null);');
    this.addSql('alter table "project" add constraint "project_user_unique" unique ("user");');

    this.addSql('alter table "project" add constraint "project_user_foreign" foreign key ("user") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" drop constraint "project_user_foreign";');
    this.addSql('alter table "project" drop constraint "project_user_unique";');
    this.addSql('drop table "project";');
  }
}

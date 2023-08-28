import { Migration } from '@mikro-orm/migrations';

export class Migration20230828193501 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "Admin" ("id" bigserial primary key, "createdAt" timestamptz not null default clock_timestamp(), "updatedAt" timestamptz not null default clock_timestamp(), "user" bigint not null);');
    this.addSql('alter table "Admin" add constraint "Admin_user_unique" unique ("user");');

    this.addSql('alter table "Admin" add constraint "Admin_user_foreign" foreign key ("user") references "User" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "Admin" cascade;');
  }

}

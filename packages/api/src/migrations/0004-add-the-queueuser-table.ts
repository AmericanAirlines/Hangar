import { Migration } from '@mikro-orm/migrations';

export class Migration20211026161035 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "queue-user" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "userId" bigint not null, "type" text not null, "status" text not null);');
    this.addSql('alter table "queue-user" add constraint "queue-user_userId_unique" unique ("userId");');

    this.addSql('alter table "queue-user" add constraint "queue-user_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table "queue-user";');
  }
}

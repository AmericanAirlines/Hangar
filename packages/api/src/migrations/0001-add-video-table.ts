import { Migration } from '@mikro-orm/migrations';

export class Migration20211002031738 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "video" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "title" text not null, "durationInSeconds" int not null, "url" text not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table "video";');
  }
}

import { Migration } from '@mikro-orm/migrations';

export class Migration20230808232125 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "User" add column "email" text not null;');
    this.addSql('alter table "User" add constraint "User_email_unique" unique ("email");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "User" drop constraint "User_email_unique";');
    this.addSql('alter table "User" drop column "email";');
  }

}

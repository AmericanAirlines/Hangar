import { Migration } from '@mikro-orm/migrations';

export class Migration20211022152911 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "purpose" to "authId";');

    this.addSql('alter table "user" rename column "hireable" to "subscribed";');

    this.addSql('alter table "user" rename column "pronouns" to "email";');

    this.addSql('alter table "user" add column "metadata" jsonb null;');
    this.addSql('alter table "user" drop column "location";');
    this.addSql('alter table "user" drop column "schoolName";');
    this.addSql('alter table "user" drop column "major";');
    this.addSql('alter table "user" drop column "graduationDate";');
  }
  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "metadata", rename column "email" to "pronouns", rename column "subscribed" to "hireable", rename column "authId" to "purpose", add column "location" text null, add column "schoolName" text null, add column "major" text null, add column "graduationDate" Date null;');
  }
}

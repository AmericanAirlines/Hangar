import { Migration } from '@mikro-orm/migrations';

export class Migration20211004042249 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" add column "pronouns" text null, add column "location" text null, add column "hireable" boolean not null, add column "purpose" text not null, add column "schoolName" text null, add column "major" text null, add column "graduationDate" Date null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "pronouns", drop column "location", drop column "hireable", drop column "purpose", drop column "schoolName", drop column "major", drop column "graduationDate";');
  }
}

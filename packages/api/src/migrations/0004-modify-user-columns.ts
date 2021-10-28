import { Migration } from '@mikro-orm/migrations';

export class Migration20211028205338 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "purpose" to "authId";');


    this.addSql('alter table "user" rename column "hireable" to "subscribed";');


    this.addSql('alter table "user" rename column "pronouns" to "email";');


    this.addSql('alter table "user" add column "metadata" jsonb null;');
    this.addSql('alter table "user" drop column "location";');
    this.addSql('alter table "user" drop column "schoolName";');
    this.addSql('alter table "user" drop column "major";');
    this.addSql('alter table "user" drop column "graduationDate";');

    this.addSql('alter table "user" add constraint "user_authId_unique" unique ("authId");');
  }

}

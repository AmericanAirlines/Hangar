import { Migration } from '@mikro-orm/migrations';

export class Migration20230926210155 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Project" add column "inviteCode" text not null;');
    this.addSql('alter table "Project" add constraint "Project_inviteCode_unique" unique ("inviteCode");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Project" drop constraint "Project_inviteCode_unique";');
    this.addSql('alter table "Project" drop column "inviteCode";');
  }

}

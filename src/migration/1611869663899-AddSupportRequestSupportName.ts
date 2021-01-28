import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSupportRequestSupportName1611869663899 implements MigrationInterface {
  name = 'AddSupportRequestSupportName1611869663899';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "support_request" ADD "supportName" character varying');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "support_request" DROP COLUMN "supportName"');
  }
}

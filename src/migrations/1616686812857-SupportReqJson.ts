import { MigrationInterface, QueryRunner } from 'typeorm';

export class SupportReqJson1616686812857 implements MigrationInterface {
    name = 'SupportReqJson1616686812857'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE "support_request" ADD "primaryLanguage" character varying');
      await queryRunner.query('ALTER TABLE "support_request" ADD "extraData" jsonb');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE "support_request" DROP COLUMN "extraData"');
      await queryRunner.query('ALTER TABLE "support_request" DROP COLUMN "primaryLanguage"');
    }
}

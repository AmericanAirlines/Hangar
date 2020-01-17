import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSupportRequestSyncHash1579227786987 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "support_request" ADD "syncHash" character varying NOT NULL', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "support_request" DROP COLUMN "syncHash"', undefined);
  }
}

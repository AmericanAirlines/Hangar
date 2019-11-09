import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTeamSyncHash1573329583500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "team" ADD "syncHash" character varying NOT NULL', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "team" DROP COLUMN "syncHash"', undefined);
  }
}

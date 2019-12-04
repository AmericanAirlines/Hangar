import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPreviousTeamColumn1574797652947 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "team" ADD "syncHash" character varying NOT NULL', undefined);
    await queryRunner.query('ALTER TABLE "judge" ADD "previousTeam" integer', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "judge" DROP COLUMN "previousTeam"', undefined);
    await queryRunner.query('ALTER TABLE "team" DROP COLUMN "syncHash"', undefined);
  }
}

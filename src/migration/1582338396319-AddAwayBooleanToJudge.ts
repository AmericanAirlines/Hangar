import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAwayBooleanToJudge1582338396319 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "judge" ADD "away" boolean NOT NULL', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "judge" DROP COLUMN "away"', undefined);
  }
}

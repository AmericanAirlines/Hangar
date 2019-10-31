import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTeamAndSubscriber1572552693558 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "team" DROP CONSTRAINT "UQ_ea8183ff4310b614ee09d44bfda"', undefined);
    await queryRunner.query('ALTER TABLE "team" DROP COLUMN "tableNumber"', undefined);
    await queryRunner.query('ALTER TABLE "team" ADD "tableNumber" integer NOT NULL', undefined);
    await queryRunner.query('ALTER TABLE "team" ADD CONSTRAINT "UQ_ea8183ff4310b614ee09d44bfda" UNIQUE ("tableNumber")', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "team" DROP CONSTRAINT "UQ_ea8183ff4310b614ee09d44bfda"', undefined);
    await queryRunner.query('ALTER TABLE "team" DROP COLUMN "tableNumber"', undefined);
    await queryRunner.query('ALTER TABLE "team" ADD "tableNumber" character varying NOT NULL', undefined);
    await queryRunner.query('ALTER TABLE "team" ADD CONSTRAINT "UQ_ea8183ff4310b614ee09d44bfda" UNIQUE ("tableNumber")', undefined);
  }
}

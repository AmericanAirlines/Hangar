import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropSubcriber1605286371672 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "subscriber"', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "subscriber" ("id" SERIAL NOT NULL, "slackId" character varying NOT NULL, CONSTRAINT "PK_1c52b7ddbaf79cd2650045b79c7" PRIMARY KEY ("id"))',
      undefined,
    );
  }
}

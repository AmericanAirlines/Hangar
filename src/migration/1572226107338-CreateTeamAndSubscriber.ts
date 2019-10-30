import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTeamAndSubscriber1572226107338 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "subscriber" ("id" SERIAL NOT NULL, "slackId" character varying NOT NULL, CONSTRAINT "PK_1c52b7ddbaf79cd2650045b79c7" PRIMARY KEY ("id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "team" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "location" character varying NOT NULL, "description" character varying NOT NULL, "members" text array NOT NULL, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "team"', undefined);
    await queryRunner.query('DROP TABLE "subscriber"', undefined);
  }
}

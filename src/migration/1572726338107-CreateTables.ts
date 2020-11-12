import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1572726338107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE "configuration" ("key" character varying NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_36aa5305bb4de9034d272f6a244" PRIMARY KEY ("key"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "team" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "tableNumber" integer NOT NULL, "projectDescription" character varying NOT NULL, "members" text NOT NULL, "judgeVisits" integer NOT NULL, "activeJudgeCount" integer NOT NULL, CONSTRAINT "UQ_ea8183ff4310b614ee09d44bfda" UNIQUE ("tableNumber"), CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "judging_vote" ("id" SERIAL NOT NULL, "previousTeam" integer NOT NULL, "currentTeam" integer NOT NULL, "currentTeamChosen" boolean NOT NULL, CONSTRAINT "PK_50f885edb5d4700705e40e27074" PRIMARY KEY ("id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "judge" ("id" SERIAL NOT NULL, "visitedTeams" text NOT NULL, "currentTeam" integer, CONSTRAINT "PK_e686dcaea5ac575a0a7fded3b46" PRIMARY KEY ("id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "subscriber" ("id" SERIAL NOT NULL, "slackId" character varying NOT NULL, CONSTRAINT "PK_1c52b7ddbaf79cd2650045b79c7" PRIMARY KEY ("id"))',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE "subscriber"', undefined);
    await queryRunner.query('DROP TABLE "judge"', undefined);
    await queryRunner.query('DROP TABLE "judging_vote"', undefined);
    await queryRunner.query('DROP TABLE "team"', undefined);
    await queryRunner.query('DROP TABLE "configuration"', undefined);
  }
}

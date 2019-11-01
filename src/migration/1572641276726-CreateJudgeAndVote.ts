import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateJudgeAndVote1572641276726 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE "judge" ("id" SERIAL NOT NULL, "visitedTeams" text NOT NULL, "currentTeam" integer, CONSTRAINT "PK_e686dcaea5ac575a0a7fded3b46" PRIMARY KEY ("id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "judging_vote" ("id" SERIAL NOT NULL, "previousTeam" integer NOT NULL, "currentTeam" integer NOT NULL, "currentTeamChosen" boolean NOT NULL, CONSTRAINT "PK_50f885edb5d4700705e40e27074" PRIMARY KEY ("id"))',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "team" ADD "judgeVisits" integer NOT NULL', undefined);
    await queryRunner.query('ALTER TABLE "team" ADD "activeJudgeCount" integer NOT NULL', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "team" DROP COLUMN "activeJudgeCount"', undefined);
    await queryRunner.query('ALTER TABLE "team" DROP COLUMN "judgeVisits"', undefined);
    await queryRunner.query('DROP TABLE "judging_vote"', undefined);
    await queryRunner.query('DROP TABLE "judge"', undefined);
  }
}

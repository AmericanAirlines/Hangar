import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAllTables1614212046878 implements MigrationInterface {
  name = 'CreateAllTables1614212046878';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "configuration" ("key" character varying NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_36aa5305bb4de9034d272f6a244" PRIMARY KEY ("key"))',
    );
    await queryRunner.query(
      'CREATE TABLE "discord_context" ("id" character varying NOT NULL, "currentCommand" character varying NOT NULL, "nextStep" character varying NOT NULL, "payload" text NOT NULL, CONSTRAINT "PK_0396a1aaa8138098a59f0ff4a8e" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "team" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "tableNumber" integer, "channelName" character varying, "projectDescription" character varying NOT NULL, "members" text NOT NULL, "judgeVisits" integer NOT NULL, "activeJudgeCount" integer NOT NULL, "syncHash" character varying NOT NULL, CONSTRAINT "UQ_ea8183ff4310b614ee09d44bfda" UNIQUE ("tableNumber"), CONSTRAINT "UQ_eaf0ef05c8c74f9302cd9807d84" UNIQUE ("channelName"), CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "judging_vote" ("id" SERIAL NOT NULL, "previousTeam" integer NOT NULL, "currentTeam" integer NOT NULL, "currentTeamChosen" boolean NOT NULL, CONSTRAINT "PK_50f885edb5d4700705e40e27074" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "judge" ("id" SERIAL NOT NULL, "visitedTeams" text NOT NULL, "currentTeam" integer, "previousTeam" integer, CONSTRAINT "PK_e686dcaea5ac575a0a7fded3b46" PRIMARY KEY ("id"))',
    );
    await queryRunner.query("CREATE TYPE \"support_request_status_enum\" AS ENUM('Pending', 'InProgress', 'Complete', 'Abandoned')");
    await queryRunner.query("CREATE TYPE \"support_request_type_enum\" AS ENUM('IdeaPitch', 'TechnicalSupport', 'JobChat')");
    await queryRunner.query(
      'CREATE TABLE "support_request" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "movedToInProgressAt" TIMESTAMP, "slackId" character varying NOT NULL, "name" character varying NOT NULL, "supportName" character varying, "status" "support_request_status_enum" NOT NULL DEFAULT \'Pending\', "type" "support_request_type_enum" NOT NULL, "syncHash" character varying NOT NULL, CONSTRAINT "PK_76db9b511f3ac27bf3237432acc" PRIMARY KEY ("id"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "support_request"');
    await queryRunner.query('DROP TYPE "support_request_type_enum"');
    await queryRunner.query('DROP TYPE "support_request_status_enum"');
    await queryRunner.query('DROP TABLE "judge"');
    await queryRunner.query('DROP TABLE "judging_vote"');
    await queryRunner.query('DROP TABLE "team"');
    await queryRunner.query('DROP TABLE "discord_context"');
    await queryRunner.query('DROP TABLE "configuration"');
  }
}

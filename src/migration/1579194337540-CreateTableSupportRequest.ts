import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableSupportRequest1579194337540 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("CREATE TYPE \"support_request_status_enum\" AS ENUM('Pending', 'InProgress', 'Complete', 'Abandoned')", undefined);
    await queryRunner.query("CREATE TYPE \"support_request_type_enum\" AS ENUM('IdeaPitch', 'TechnicalSupport')", undefined);
    await queryRunner.query(
      'CREATE TABLE "support_request" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "movedToInProgressAt" TIMESTAMP, "slackId" character varying NOT NULL, "name" character varying NOT NULL, "status" "support_request_status_enum" NOT NULL DEFAULT \'Pending\', "type" "support_request_type_enum" NOT NULL, CONSTRAINT "PK_76db9b511f3ac27bf3237432acc" PRIMARY KEY ("id"))',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE "support_request"', undefined);
    await queryRunner.query('DROP TYPE "support_request_type_enum"', undefined);
    await queryRunner.query('DROP TYPE "support_request_status_enum"', undefined);
  }
}

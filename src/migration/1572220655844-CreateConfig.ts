import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConfig1572220655844 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "configuration" ("key" character varying NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_26489c99ddbb4c91631ef5cc791" PRIMARY KEY ("key"))',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "configuration"', undefined);
  }
}

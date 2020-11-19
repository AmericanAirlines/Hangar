import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDiscordContext1604939986968 implements MigrationInterface {
  name = 'CreateDiscordContext1604939986968';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "discord_context" ("id" character varying NOT NULL, "nextStep" character varying NOT NULL, CONSTRAINT "PK_0396a1aaa8138098a59f0ff4a8e" PRIMARY KEY ("id"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "discord_context"');
  }
}

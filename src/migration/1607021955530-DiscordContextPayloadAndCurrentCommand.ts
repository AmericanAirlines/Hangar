import { MigrationInterface, QueryRunner } from 'typeorm';

export class DiscordContextPayloadAndCurrentCommand1607021955530 implements MigrationInterface {
  name = 'DiscordContextPayloadAndCurrentCommand1607021955530';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "discord_context" ADD "currentCommand" character varying NOT NULL');
    await queryRunner.query('ALTER TABLE "discord_context" ADD "payload" json NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "discord_context" DROP COLUMN "payload"');
    await queryRunner.query('ALTER TABLE "discord_context" DROP COLUMN "currentCommand"');
  }
}

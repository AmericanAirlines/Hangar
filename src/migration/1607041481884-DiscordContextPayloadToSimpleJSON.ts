import { MigrationInterface, QueryRunner } from 'typeorm';

export class DiscordContextPayloadToSimpleJSON1607041481884 implements MigrationInterface {
  name = 'DiscordContextPayloadToSimpleJSON1607041481884';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "discord_context" DROP COLUMN "payload"');
    await queryRunner.query('ALTER TABLE "discord_context" ADD "payload" text NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "discord_context" DROP COLUMN "payload"');
    await queryRunner.query('ALTER TABLE "discord_context" ADD "payload" json NOT NULL');
  }
}

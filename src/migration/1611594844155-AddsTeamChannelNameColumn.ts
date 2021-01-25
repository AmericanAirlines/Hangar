import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddsTeamChannelNameColumn1611594844155 implements MigrationInterface {
  name = 'AddsTeamChannelNameColumn1611594844155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "team" ADD "channelName" character varying');
    await queryRunner.query('ALTER TABLE "team" ADD CONSTRAINT "UQ_eaf0ef05c8c74f9302cd9807d84" UNIQUE ("channelName")');
    await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "tableNumber" DROP NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "tableNumber" SET NOT NULL');
    await queryRunner.query('ALTER TABLE "team" DROP CONSTRAINT "UQ_eaf0ef05c8c74f9302cd9807d84"');
    await queryRunner.query('ALTER TABLE "team" DROP COLUMN "channelName"');
  }
}

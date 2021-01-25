import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveTableNumAddChannelName1611587257439 implements MigrationInterface {
  name = 'removeTableNumAddChannelName1611587257439';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "team" RENAME COLUMN "tableNumber" TO "channelName"');
    await queryRunner.query('ALTER TABLE "team" RENAME CONSTRAINT "UQ_ea8183ff4310b614ee09d44bfda" TO "UQ_eaf0ef05c8c74f9302cd9807d84"');
    await queryRunner.query('ALTER TABLE "team" DROP CONSTRAINT "UQ_eaf0ef05c8c74f9302cd9807d84"');
    await queryRunner.query('ALTER TABLE "team" DROP COLUMN "channelName"');
    await queryRunner.query('ALTER TABLE "team" ADD "channelName" character varying NOT NULL');
    await queryRunner.query('ALTER TABLE "team" ADD CONSTRAINT "UQ_eaf0ef05c8c74f9302cd9807d84" UNIQUE ("channelName")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "team" DROP CONSTRAINT "UQ_eaf0ef05c8c74f9302cd9807d84"');
    await queryRunner.query('ALTER TABLE "team" DROP COLUMN "channelName"');
    await queryRunner.query('ALTER TABLE "team" ADD "channelName" integer NOT NULL');
    await queryRunner.query('ALTER TABLE "team" ADD CONSTRAINT "UQ_eaf0ef05c8c74f9302cd9807d84" UNIQUE ("channelName")');
    await queryRunner.query('ALTER TABLE "team" RENAME CONSTRAINT "UQ_eaf0ef05c8c74f9302cd9807d84" TO "UQ_ea8183ff4310b614ee09d44bfda"');
    await queryRunner.query('ALTER TABLE "team" RENAME COLUMN "channelName" TO "tableNumber"');
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTeamChannelNameOption1611590965568 implements MigrationInterface {
  name = 'AddTeamChannelNameOption1611590965568';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "team" ADD "tableNumber" integer');
    await queryRunner.query('ALTER TABLE "team" ADD CONSTRAINT "UQ_ea8183ff4310b614ee09d44bfda" UNIQUE ("tableNumber")');
    await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "channelName" DROP NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "channelName" SET NOT NULL');
    await queryRunner.query('ALTER TABLE "team" DROP CONSTRAINT "UQ_ea8183ff4310b614ee09d44bfda"');
    await queryRunner.query('ALTER TABLE "team" DROP COLUMN "tableNumber"');
  }
}

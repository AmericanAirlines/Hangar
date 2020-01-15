import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeSubscriberSlackIdUnique1578955566306 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "subscriber" ADD CONSTRAINT "UQ_c9fd52bfb6e437c46b571c9c428" UNIQUE ("slackId")', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "subscriber" DROP CONSTRAINT "UQ_c9fd52bfb6e437c46b571c9c428"', undefined);
  }
}

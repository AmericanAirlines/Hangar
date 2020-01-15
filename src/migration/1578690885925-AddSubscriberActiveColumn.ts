import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubscriberActiveColumn1578690885925 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "subscriber" ADD "isActive" boolean NOT NULL DEFAULT true', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "subscriber" DROP COLUMN "isActive"', undefined);
  }
}

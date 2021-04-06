import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConfigJsonb1616077019382 implements MigrationInterface {
    name = 'ConfigJsonb1616077019382'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE "configuration" DROP COLUMN "value"');
      await queryRunner.query('ALTER TABLE "configuration" ADD "value" jsonb DEFAULT null');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE "configuration" DROP COLUMN "value"');
      await queryRunner.query('ALTER TABLE "configuration" ADD "value" character varying NOT NULL');
    }
}

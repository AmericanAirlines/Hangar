import {MigrationInterface, QueryRunner} from "typeorm";

export class ConfigJsonb1615931261776 implements MigrationInterface {
    name = 'ConfigJsonb1615931261776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "configuration" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "configuration" ADD "value" jsonb DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "configuration" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "configuration" ADD "value" character varying NOT NULL`);
    }

}

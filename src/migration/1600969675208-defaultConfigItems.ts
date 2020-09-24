import {MigrationInterface, QueryRunner} from "typeorm";

export class defaultConfigItems1600969675208 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            'INSERT INTO "configuration" ("key", "value") VALUES ("teamRegistrationActive", "true")', undefined
          );
        await queryRunner.query(
            'INSERT INTO "configuration" ("key", "value") VALUES ("supportRequestQueueActive", "true")', undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            'DELETE FROM "configuration" WHERE key="teamRegistrationActive" AND value="true"', undefined
          );
        await queryRunner.query(
            'DELETE FROM "configuration" WHERE key="supportRequestQueueActive" AND value="ture"', undefined
        );
        
    }
}

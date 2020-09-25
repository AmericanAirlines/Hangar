import { MigrationInterface, QueryRunner } from 'typeorm';

export class defaultConfigItems1600969675208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('INSERT INTO "configuration" ("key", "value") VALUES ("teamRegistrationActive", "false")', undefined);
    await queryRunner.query('INSERT INTO "configuration" ("key", "value") VALUES ("supportRequestQueueActive", "false")', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DELETE FROM "configuration" WHERE key="teamRegistrationActive" AND value="false"', undefined);
    await queryRunner.query('DELETE FROM "configuration" WHERE key="supportRequestQueueActive" AND value="false"', undefined);
  }
}

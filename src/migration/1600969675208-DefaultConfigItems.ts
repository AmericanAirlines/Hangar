import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultConfigItems1600969675208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'INSERT INTO "configuration" ("key", "value") VALUES (\'teamRegistrationActive\', \'false\') ON CONFLICT DO NOTHING',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "configuration" ("key", "value") VALUES (\'supportRequestQueueActive\', \'false\') ON CONFLICT DO NOTHING',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DELETE FROM \"configuration\" WHERE key='teamRegistrationActive' AND value='false'", undefined);
    await queryRunner.query("DELETE FROM \"configuration\" WHERE key='supportRequestQueueActive' AND value='false'", undefined);
  }
}

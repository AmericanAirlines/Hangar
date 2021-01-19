import {MigrationInterface, QueryRunner} from "typeorm";

export class AddJobChatToSupportRequest1610634429473 implements MigrationInterface {
    name = 'AddJobChatToSupportRequest1610634429473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."support_request_type_enum" RENAME TO "support_request_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "support_request_type_enum" AS ENUM('IdeaPitch', 'TechnicalSupport', 'JobChat')`);
        await queryRunner.query(`ALTER TABLE "support_request" ALTER COLUMN "type" TYPE "support_request_type_enum" USING "type"::"text"::"support_request_type_enum"`);
        await queryRunner.query(`DROP TYPE "support_request_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "support_request_type_enum_old" AS ENUM('IdeaPitch', 'TechnicalSupport')`);
        await queryRunner.query(`ALTER TABLE "support_request" ALTER COLUMN "type" TYPE "support_request_type_enum_old" USING "type"::"text"::"support_request_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "support_request_type_enum"`);
        await queryRunner.query(`ALTER TYPE "support_request_type_enum_old" RENAME TO  "support_request_type_enum"`);
    }

}

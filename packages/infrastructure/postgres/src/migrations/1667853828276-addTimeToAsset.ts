import type { MigrationInterface, QueryRunner } from "typeorm";

export class addTimeToAsset1667853828276 implements MigrationInterface {
    name = 'addTimeToAsset1667853828276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset_value" ADD "dateTime" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset_value" DROP COLUMN "dateTime"`);
    }

}

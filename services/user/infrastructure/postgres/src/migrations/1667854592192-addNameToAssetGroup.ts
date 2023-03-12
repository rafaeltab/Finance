import type { MigrationInterface, QueryRunner } from "typeorm";

export class addNameToAssetGroup1667854592192 implements MigrationInterface {
    name = 'addNameToAssetGroup1667854592192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_account" ADD "balanceUniqueId" uuid`);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD CONSTRAINT "UQ_61cc09a88f34ca9fd1e6787076d" UNIQUE ("balanceUniqueId")`);
        await queryRunner.query(`ALTER TABLE "asset_group" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD CONSTRAINT "FK_61cc09a88f34ca9fd1e6787076d" FOREIGN KEY ("balanceUniqueId") REFERENCES "balance"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_account" DROP CONSTRAINT "FK_61cc09a88f34ca9fd1e6787076d"`);
        await queryRunner.query(`ALTER TABLE "asset_group" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "bank_account" DROP CONSTRAINT "UQ_61cc09a88f34ca9fd1e6787076d"`);
        await queryRunner.query(`ALTER TABLE "bank_account" DROP COLUMN "balanceUniqueId"`);
    }

}

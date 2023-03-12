import type { MigrationInterface, QueryRunner } from "typeorm";

export class numberOptions1672947580058 implements MigrationInterface {
    name = 'numberOptions1672947580058'

    public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "balance" ALTER COLUMN "amount" TYPE numeric`);
		await queryRunner.query(`ALTER TABLE "active_income" ALTER COLUMN "monthlySalary" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_value" ALTER COLUMN "high" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_value" ALTER COLUMN "low" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_value" ALTER COLUMN "close" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_value" ALTER COLUMN "volume" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_order" ALTER COLUMN "amount" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_order" ALTER COLUMN "usdPrice" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_order" ALTER COLUMN "usdPrice" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_order" ALTER COLUMN "amount" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_value" ALTER COLUMN "volume" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_value" ALTER COLUMN "close" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_value" ALTER COLUMN "low" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_value" ALTER COLUMN "high" TYPE numeric`);
		await queryRunner.query(`ALTER TABLE "active_income" ALTER COLUMN "monthlySalary" TYPE integer`);
		await queryRunner.query(`ALTER TABLE "balance" ALTER COLUMN "amount" TYPE integer`);
    }

}

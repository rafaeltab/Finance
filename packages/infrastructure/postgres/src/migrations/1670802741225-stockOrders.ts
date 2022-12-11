import { MigrationInterface, QueryRunner } from "typeorm";

export class stockOrders1670802741225 implements MigrationInterface {
    name = 'stockOrders1670802741225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_asset" RENAME COLUMN "amount" TO "assetKind"`);
        await queryRunner.query(`CREATE TABLE "stock_order" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric NOT NULL, "usdPrice" numeric NOT NULL, "stockAssetUniqueId" uuid, CONSTRAINT "PK_ed3af626ce98c46456d609046aa" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`ALTER TABLE "asset_value" ALTER COLUMN "usdValue" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_asset" DROP COLUMN "assetKind"`);
        await queryRunner.query(`CREATE TYPE "public"."stock_asset_assetkind_enum" AS ENUM('CS', 'ADRC', 'ADRP', 'ADRR', 'UNIT', 'RIGHT', 'PFD', 'FUND', 'SP', 'WARRANT', 'INDEX', 'ETF', 'ETN', 'OS', 'GDR', 'OTHER', 'NYRS', 'AGEN', 'EQLK', 'BOND', 'ADRW', 'BASKET', 'LT')`);
        await queryRunner.query(`ALTER TABLE "stock_asset" ADD "assetKind" "public"."stock_asset_assetkind_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock_order" ADD CONSTRAINT "FK_ad4e9057ad0cec755e6e502ec61" FOREIGN KEY ("stockAssetUniqueId") REFERENCES "stock_asset"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_order" DROP CONSTRAINT "FK_ad4e9057ad0cec755e6e502ec61"`);
        await queryRunner.query(`ALTER TABLE "stock_asset" DROP COLUMN "assetKind"`);
        await queryRunner.query(`DROP TYPE "public"."stock_asset_assetkind_enum"`);
        await queryRunner.query(`ALTER TABLE "stock_asset" ADD "assetKind" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "asset_value" ALTER COLUMN "usdValue" TYPE numeric`);
        await queryRunner.query(`DROP TABLE "stock_order"`);
        await queryRunner.query(`ALTER TABLE "stock_asset" RENAME COLUMN "assetKind" TO "amount"`);
    }

}

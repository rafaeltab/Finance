import type { MigrationInterface, QueryRunner } from "typeorm";

export class stockData1672513071280 implements MigrationInterface {
    name = 'stockData1672513071280'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stock_dividend_event" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "amount" numeric(10) NOT NULL, "stockDataUniqueId" uuid, CONSTRAINT "PK_ae09223091e8d9c36dc8642bc5c" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`CREATE TABLE "stock_split_event" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "ratio" numeric(10) NOT NULL, "stockDataUniqueId" uuid, CONSTRAINT "PK_28987a2f990e6bb2d88f7739b31" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`CREATE TABLE "stock_value" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "open" numeric(10,3) NOT NULL, "high" numeric NOT NULL, "low" numeric NOT NULL, "close" numeric NOT NULL, "volume" numeric NOT NULL, "date" TIMESTAMP NOT NULL, "stockDataUniqueId" uuid, CONSTRAINT "PK_3894057068fd2c8a07828cfa962" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`CREATE TYPE "public"."stock_data_assetkind_enum" AS ENUM('CS', 'ADRC', 'ADRP', 'ADRR', 'UNIT', 'RIGHT', 'PFD', 'FUND', 'SP', 'WARRANT', 'INDEX', 'ETF', 'ETN', 'OS', 'GDR', 'OTHER', 'NYRS', 'AGEN', 'EQLK', 'BOND', 'ADRW', 'BASKET', 'LT')`);
        await queryRunner.query(`CREATE TABLE "stock_data" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "identity" character varying NOT NULL, "symbol" character varying NOT NULL, "exchange" character varying NOT NULL, "assetKind" "public"."stock_data_assetkind_enum" NOT NULL, CONSTRAINT "PK_2c7a732b5385e8815602e5e095e" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_43e7b50a190d7afa726f6a7360" ON "stock_data" ("identity") `);
        await queryRunner.query(`ALTER TABLE "stock_asset" DROP COLUMN "symbol"`);
        await queryRunner.query(`ALTER TABLE "stock_asset" DROP COLUMN "exchange"`);
        await queryRunner.query(`ALTER TABLE "stock_asset" DROP COLUMN "assetKind"`);
        await queryRunner.query(`DROP TYPE "public"."stock_asset_assetkind_enum"`);
        await queryRunner.query(`ALTER TABLE "stock_asset" ADD "stockDataUniqueId" uuid`);
        await queryRunner.query(`ALTER TABLE "stock_order" ALTER COLUMN "amount" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_order" ALTER COLUMN "usdPrice" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_dividend_event" ADD CONSTRAINT "FK_cb852f3b5b7d4c0236f3e594f8f" FOREIGN KEY ("stockDataUniqueId") REFERENCES "stock_data"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_split_event" ADD CONSTRAINT "FK_34737b184549cfbe86d27613956" FOREIGN KEY ("stockDataUniqueId") REFERENCES "stock_data"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_value" ADD CONSTRAINT "FK_9bcde3cb6351636bc5a3d4550c8" FOREIGN KEY ("stockDataUniqueId") REFERENCES "stock_data"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_asset" ADD CONSTRAINT "FK_28453015c05a0ad0a029216eb88" FOREIGN KEY ("stockDataUniqueId") REFERENCES "stock_data"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_asset" DROP CONSTRAINT "FK_28453015c05a0ad0a029216eb88"`);
        await queryRunner.query(`ALTER TABLE "stock_value" DROP CONSTRAINT "FK_9bcde3cb6351636bc5a3d4550c8"`);
        await queryRunner.query(`ALTER TABLE "stock_split_event" DROP CONSTRAINT "FK_34737b184549cfbe86d27613956"`);
        await queryRunner.query(`ALTER TABLE "stock_dividend_event" DROP CONSTRAINT "FK_cb852f3b5b7d4c0236f3e594f8f"`);
        await queryRunner.query(`ALTER TABLE "stock_order" ALTER COLUMN "usdPrice" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_order" ALTER COLUMN "amount" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "stock_asset" DROP COLUMN "stockDataUniqueId"`);
        await queryRunner.query(`CREATE TYPE "public"."stock_asset_assetkind_enum" AS ENUM('CS', 'ADRC', 'ADRP', 'ADRR', 'UNIT', 'RIGHT', 'PFD', 'FUND', 'SP', 'WARRANT', 'INDEX', 'ETF', 'ETN', 'OS', 'GDR', 'OTHER', 'NYRS', 'AGEN', 'EQLK', 'BOND', 'ADRW', 'BASKET', 'LT')`);
        await queryRunner.query(`ALTER TABLE "stock_asset" ADD "assetKind" "public"."stock_asset_assetkind_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock_asset" ADD "exchange" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock_asset" ADD "symbol" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_43e7b50a190d7afa726f6a7360"`);
        await queryRunner.query(`DROP TABLE "stock_data"`);
        await queryRunner.query(`DROP TYPE "public"."stock_data_assetkind_enum"`);
        await queryRunner.query(`DROP TABLE "stock_value"`);
        await queryRunner.query(`DROP TABLE "stock_split_event"`);
        await queryRunner.query(`DROP TABLE "stock_dividend_event"`);
    }

}

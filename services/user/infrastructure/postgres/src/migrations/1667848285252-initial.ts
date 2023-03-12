import type { MigrationInterface, QueryRunner } from "typeorm";

export class initial1667848285252 implements MigrationInterface {
    name = 'initial1667848285252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "identity" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "age" integer NOT NULL, CONSTRAINT "UQ_feed62e99fa47b221331fa53069" UNIQUE ("identity"), CONSTRAINT "PK_e484df0e7ce110d49e4cb0965b8" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_feed62e99fa47b221331fa5306" ON "user" ("identity") `);
        await queryRunner.query(`CREATE TABLE "asset_group" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "identity" character varying NOT NULL, "userUniqueId" uuid, CONSTRAINT "UQ_9917030696ebe02168df50204bc" UNIQUE ("identity"), CONSTRAINT "PK_35cf6fb2800a7b5bdb3a59062b2" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9917030696ebe02168df50204b" ON "asset_group" ("identity") `);
        await queryRunner.query(`CREATE TABLE "asset_value" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "usdValue" integer NOT NULL, "assetUniqueId" uuid, CONSTRAINT "PK_8811786dfc37401a03b8fb28e91" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`CREATE TABLE "asset" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "identity" character varying NOT NULL, "groupUniqueId" uuid, "userUniqueId" uuid, CONSTRAINT "UQ_0f011e4728a474b98bc77c29356" UNIQUE ("identity"), CONSTRAINT "PK_9d54871fac9a22e7bb944654595" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0f011e4728a474b98bc77c2935" ON "asset" ("identity") `);
        await queryRunner.query(`CREATE TABLE "real_estate_asset" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "identity" character varying NOT NULL, "address" character varying NOT NULL, CONSTRAINT "UQ_a58873d093a71b1116ecbc76afc" UNIQUE ("identity"), CONSTRAINT "PK_bdb8812b41b3fd67311155af293" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a58873d093a71b1116ecbc76af" ON "real_estate_asset" ("identity") `);
        await queryRunner.query(`CREATE TABLE "stock_asset" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "identity" character varying NOT NULL, "amount" integer NOT NULL, "symbol" character varying NOT NULL, "exchange" character varying NOT NULL, CONSTRAINT "UQ_7615896ebf08fb123a1fd175353" UNIQUE ("identity"), CONSTRAINT "PK_8bcf1d1e4371f1205ec3cd23fd0" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7615896ebf08fb123a1fd17535" ON "stock_asset" ("identity") `);
        await queryRunner.query(`CREATE TABLE "active_income" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "monthlySalary" integer NOT NULL, CONSTRAINT "PK_83b8974b64bf145595f812685fb" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`CREATE TABLE "job" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "identity" character varying NOT NULL, "title" character varying NOT NULL, "activeIncomeUniqueId" uuid, CONSTRAINT "UQ_0d8f25fb716a51e6adf2b1a19e5" UNIQUE ("identity"), CONSTRAINT "REL_8883a0924da68afa1344a12e75" UNIQUE ("activeIncomeUniqueId"), CONSTRAINT "PK_24b7881b9d6c477ae43edda968d" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0d8f25fb716a51e6adf2b1a19e" ON "job" ("identity") `);
        await queryRunner.query(`CREATE TABLE "balance" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "currency" character varying NOT NULL, CONSTRAINT "PK_8e27094e6a55820ba9b18a37d9e" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`CREATE TABLE "bank_account" ("uniqueId" uuid NOT NULL DEFAULT uuid_generate_v4(), "identity" character varying NOT NULL, "bank" character varying NOT NULL, CONSTRAINT "UQ_4f459bd6072ce40013cc3806afd" UNIQUE ("identity"), CONSTRAINT "PK_3e8284ef28267bc1fc371a3da68" PRIMARY KEY ("uniqueId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4f459bd6072ce40013cc3806af" ON "bank_account" ("identity") `);
        await queryRunner.query(`ALTER TABLE "asset_group" ADD CONSTRAINT "FK_0ffc8b1dd9b3de64de0957fdd65" FOREIGN KEY ("userUniqueId") REFERENCES "user"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_value" ADD CONSTRAINT "FK_319fa5baca258ec3b5a65a65aa8" FOREIGN KEY ("assetUniqueId") REFERENCES "asset"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_425fe8fb7dab83e9870dd2c20d3" FOREIGN KEY ("groupUniqueId") REFERENCES "asset_group"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_8d0984bbc19cb4dc7539a5f9c78" FOREIGN KEY ("userUniqueId") REFERENCES "user"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_8883a0924da68afa1344a12e75a" FOREIGN KEY ("activeIncomeUniqueId") REFERENCES "active_income"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_8883a0924da68afa1344a12e75a"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_8d0984bbc19cb4dc7539a5f9c78"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_425fe8fb7dab83e9870dd2c20d3"`);
        await queryRunner.query(`ALTER TABLE "asset_value" DROP CONSTRAINT "FK_319fa5baca258ec3b5a65a65aa8"`);
        await queryRunner.query(`ALTER TABLE "asset_group" DROP CONSTRAINT "FK_0ffc8b1dd9b3de64de0957fdd65"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4f459bd6072ce40013cc3806af"`);
        await queryRunner.query(`DROP TABLE "bank_account"`);
        await queryRunner.query(`DROP TABLE "balance"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d8f25fb716a51e6adf2b1a19e"`);
        await queryRunner.query(`DROP TABLE "job"`);
        await queryRunner.query(`DROP TABLE "active_income"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7615896ebf08fb123a1fd17535"`);
        await queryRunner.query(`DROP TABLE "stock_asset"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a58873d093a71b1116ecbc76af"`);
        await queryRunner.query(`DROP TABLE "real_estate_asset"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f011e4728a474b98bc77c2935"`);
        await queryRunner.query(`DROP TABLE "asset"`);
        await queryRunner.query(`DROP TABLE "asset_value"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9917030696ebe02168df50204b"`);
        await queryRunner.query(`DROP TABLE "asset_group"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_feed62e99fa47b221331fa5306"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

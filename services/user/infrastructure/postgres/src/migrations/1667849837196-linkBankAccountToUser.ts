import type { MigrationInterface, QueryRunner } from "typeorm";

export class linkBankAccountToUser1667849837196 implements MigrationInterface {
    name = 'linkBankAccountToUser1667849837196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4f459bd6072ce40013cc3806af"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_feed62e99fa47b221331fa5306"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9917030696ebe02168df50204b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f011e4728a474b98bc77c2935"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a58873d093a71b1116ecbc76af"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7615896ebf08fb123a1fd17535"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d8f25fb716a51e6adf2b1a19e"`);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD "userUniqueId" uuid`);
        await queryRunner.query(`ALTER TABLE "bank_account" DROP CONSTRAINT "UQ_4f459bd6072ce40013cc3806afd"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_feed62e99fa47b221331fa53069"`);
        await queryRunner.query(`ALTER TABLE "asset_group" DROP CONSTRAINT "UQ_9917030696ebe02168df50204bc"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "UQ_0f011e4728a474b98bc77c29356"`);
        await queryRunner.query(`ALTER TABLE "real_estate_asset" DROP CONSTRAINT "UQ_a58873d093a71b1116ecbc76afc"`);
        await queryRunner.query(`ALTER TABLE "stock_asset" DROP CONSTRAINT "UQ_7615896ebf08fb123a1fd175353"`);
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "UQ_0d8f25fb716a51e6adf2b1a19e5"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4f459bd6072ce40013cc3806af" ON "bank_account" ("identity") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_feed62e99fa47b221331fa5306" ON "user" ("identity") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9917030696ebe02168df50204b" ON "asset_group" ("identity") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0f011e4728a474b98bc77c2935" ON "asset" ("identity") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a58873d093a71b1116ecbc76af" ON "real_estate_asset" ("identity") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7615896ebf08fb123a1fd17535" ON "stock_asset" ("identity") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0d8f25fb716a51e6adf2b1a19e" ON "job" ("identity") `);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD CONSTRAINT "FK_b783d446d2ee16e7615e8c268a5" FOREIGN KEY ("userUniqueId") REFERENCES "user"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_account" DROP CONSTRAINT "FK_b783d446d2ee16e7615e8c268a5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d8f25fb716a51e6adf2b1a19e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7615896ebf08fb123a1fd17535"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a58873d093a71b1116ecbc76af"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f011e4728a474b98bc77c2935"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9917030696ebe02168df50204b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_feed62e99fa47b221331fa5306"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4f459bd6072ce40013cc3806af"`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "UQ_0d8f25fb716a51e6adf2b1a19e5" UNIQUE ("identity")`);
        await queryRunner.query(`ALTER TABLE "stock_asset" ADD CONSTRAINT "UQ_7615896ebf08fb123a1fd175353" UNIQUE ("identity")`);
        await queryRunner.query(`ALTER TABLE "real_estate_asset" ADD CONSTRAINT "UQ_a58873d093a71b1116ecbc76afc" UNIQUE ("identity")`);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "UQ_0f011e4728a474b98bc77c29356" UNIQUE ("identity")`);
        await queryRunner.query(`ALTER TABLE "asset_group" ADD CONSTRAINT "UQ_9917030696ebe02168df50204bc" UNIQUE ("identity")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_feed62e99fa47b221331fa53069" UNIQUE ("identity")`);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD CONSTRAINT "UQ_4f459bd6072ce40013cc3806afd" UNIQUE ("identity")`);
        await queryRunner.query(`ALTER TABLE "bank_account" DROP COLUMN "userUniqueId"`);
        await queryRunner.query(`CREATE INDEX "IDX_0d8f25fb716a51e6adf2b1a19e" ON "job" ("identity") `);
        await queryRunner.query(`CREATE INDEX "IDX_7615896ebf08fb123a1fd17535" ON "stock_asset" ("identity") `);
        await queryRunner.query(`CREATE INDEX "IDX_a58873d093a71b1116ecbc76af" ON "real_estate_asset" ("identity") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f011e4728a474b98bc77c2935" ON "asset" ("identity") `);
        await queryRunner.query(`CREATE INDEX "IDX_9917030696ebe02168df50204b" ON "asset_group" ("identity") `);
        await queryRunner.query(`CREATE INDEX "IDX_feed62e99fa47b221331fa5306" ON "user" ("identity") `);
        await queryRunner.query(`CREATE INDEX "IDX_4f459bd6072ce40013cc3806af" ON "bank_account" ("identity") `);
    }

}

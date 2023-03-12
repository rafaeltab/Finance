import type { MigrationInterface, QueryRunner } from "typeorm";

export class dateOfBirthInsteadOfAge1670787247502 implements MigrationInterface {
    name = 'dateOfBirthInsteadOfAge1670787247502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_account" DROP CONSTRAINT "FK_b783d446d2ee16e7615e8c268a5"`);
        await queryRunner.query(`ALTER TABLE "bank_account" DROP CONSTRAINT "FK_61cc09a88f34ca9fd1e6787076d"`);
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_b23ed438395345f2784726c3b8d"`);
        await queryRunner.query(`ALTER TABLE "asset_group" DROP CONSTRAINT "FK_0ffc8b1dd9b3de64de0957fdd65"`);
        await queryRunner.query(`ALTER TABLE "asset_value" DROP CONSTRAINT "FK_319fa5baca258ec3b5a65a65aa8"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_425fe8fb7dab83e9870dd2c20d3"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_8d0984bbc19cb4dc7539a5f9c78"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "age" TO "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "bank_account" DROP CONSTRAINT "UQ_61cc09a88f34ca9fd1e6787076d"`);
        await queryRunner.query(`ALTER TABLE "bank_account" DROP COLUMN "balanceUniqueId"`);
        await queryRunner.query(`ALTER TABLE "balance" ADD "bankAccountUniqueId" uuid`);
        await queryRunner.query(`ALTER TABLE "balance" ADD CONSTRAINT "UQ_64ca6e4e0e3023176693d1ad39c" UNIQUE ("bankAccountUniqueId")`);
        await queryRunner.query(`ALTER TABLE "stock_asset" ADD "assetUniqueId" uuid`);
        await queryRunner.query(`ALTER TABLE "stock_asset" ADD CONSTRAINT "UQ_d471b81c2557822ea39cbc8f048" UNIQUE ("assetUniqueId")`);
        await queryRunner.query(`ALTER TABLE "real_estate_asset" ADD "assetUniqueId" uuid`);
        await queryRunner.query(`ALTER TABLE "real_estate_asset" ADD CONSTRAINT "UQ_ae5d4854d5bdbb99876be1c9470" UNIQUE ("assetUniqueId")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dateOfBirth" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "asset_value" DROP COLUMN "usdValue"`);
        await queryRunner.query(`ALTER TABLE "asset_value" ADD "usdValue" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "balance" ADD CONSTRAINT "FK_64ca6e4e0e3023176693d1ad39c" FOREIGN KEY ("bankAccountUniqueId") REFERENCES "bank_account"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD CONSTRAINT "FK_b783d446d2ee16e7615e8c268a5" FOREIGN KEY ("userUniqueId") REFERENCES "user"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_b23ed438395345f2784726c3b8d" FOREIGN KEY ("userUniqueId") REFERENCES "user"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_group" ADD CONSTRAINT "FK_0ffc8b1dd9b3de64de0957fdd65" FOREIGN KEY ("userUniqueId") REFERENCES "user"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_value" ADD CONSTRAINT "FK_319fa5baca258ec3b5a65a65aa8" FOREIGN KEY ("assetUniqueId") REFERENCES "asset"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_asset" ADD CONSTRAINT "FK_d471b81c2557822ea39cbc8f048" FOREIGN KEY ("assetUniqueId") REFERENCES "asset"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "real_estate_asset" ADD CONSTRAINT "FK_ae5d4854d5bdbb99876be1c9470" FOREIGN KEY ("assetUniqueId") REFERENCES "asset"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_425fe8fb7dab83e9870dd2c20d3" FOREIGN KEY ("groupUniqueId") REFERENCES "asset_group"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_8d0984bbc19cb4dc7539a5f9c78" FOREIGN KEY ("userUniqueId") REFERENCES "user"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_8d0984bbc19cb4dc7539a5f9c78"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_425fe8fb7dab83e9870dd2c20d3"`);
        await queryRunner.query(`ALTER TABLE "real_estate_asset" DROP CONSTRAINT "FK_ae5d4854d5bdbb99876be1c9470"`);
        await queryRunner.query(`ALTER TABLE "stock_asset" DROP CONSTRAINT "FK_d471b81c2557822ea39cbc8f048"`);
        await queryRunner.query(`ALTER TABLE "asset_value" DROP CONSTRAINT "FK_319fa5baca258ec3b5a65a65aa8"`);
        await queryRunner.query(`ALTER TABLE "asset_group" DROP CONSTRAINT "FK_0ffc8b1dd9b3de64de0957fdd65"`);
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_b23ed438395345f2784726c3b8d"`);
        await queryRunner.query(`ALTER TABLE "bank_account" DROP CONSTRAINT "FK_b783d446d2ee16e7615e8c268a5"`);
        await queryRunner.query(`ALTER TABLE "balance" DROP CONSTRAINT "FK_64ca6e4e0e3023176693d1ad39c"`);
        await queryRunner.query(`ALTER TABLE "asset_value" DROP COLUMN "usdValue"`);
        await queryRunner.query(`ALTER TABLE "asset_value" ADD "usdValue" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dateOfBirth" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "real_estate_asset" DROP CONSTRAINT "UQ_ae5d4854d5bdbb99876be1c9470"`);
        await queryRunner.query(`ALTER TABLE "real_estate_asset" DROP COLUMN "assetUniqueId"`);
        await queryRunner.query(`ALTER TABLE "stock_asset" DROP CONSTRAINT "UQ_d471b81c2557822ea39cbc8f048"`);
        await queryRunner.query(`ALTER TABLE "stock_asset" DROP COLUMN "assetUniqueId"`);
        await queryRunner.query(`ALTER TABLE "balance" DROP CONSTRAINT "UQ_64ca6e4e0e3023176693d1ad39c"`);
        await queryRunner.query(`ALTER TABLE "balance" DROP COLUMN "bankAccountUniqueId"`);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD "balanceUniqueId" uuid`);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD CONSTRAINT "UQ_61cc09a88f34ca9fd1e6787076d" UNIQUE ("balanceUniqueId")`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "dateOfBirth" TO "age"`);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_8d0984bbc19cb4dc7539a5f9c78" FOREIGN KEY ("userUniqueId") REFERENCES "user"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_425fe8fb7dab83e9870dd2c20d3" FOREIGN KEY ("groupUniqueId") REFERENCES "asset_group"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_value" ADD CONSTRAINT "FK_319fa5baca258ec3b5a65a65aa8" FOREIGN KEY ("assetUniqueId") REFERENCES "asset"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_group" ADD CONSTRAINT "FK_0ffc8b1dd9b3de64de0957fdd65" FOREIGN KEY ("userUniqueId") REFERENCES "user"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_b23ed438395345f2784726c3b8d" FOREIGN KEY ("userUniqueId") REFERENCES "user"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD CONSTRAINT "FK_61cc09a88f34ca9fd1e6787076d" FOREIGN KEY ("balanceUniqueId") REFERENCES "balance"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD CONSTRAINT "FK_b783d446d2ee16e7615e8c268a5" FOREIGN KEY ("userUniqueId") REFERENCES "user"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

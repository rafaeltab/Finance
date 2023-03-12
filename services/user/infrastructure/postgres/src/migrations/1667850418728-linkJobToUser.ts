import type { MigrationInterface, QueryRunner } from "typeorm";

export class linkJobToUser1667850418728 implements MigrationInterface {
    name = 'linkJobToUser1667850418728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" ADD "userUniqueId" uuid`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_b23ed438395345f2784726c3b8d" FOREIGN KEY ("userUniqueId") REFERENCES "user"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_b23ed438395345f2784726c3b8d"`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "userUniqueId"`);
    }

}

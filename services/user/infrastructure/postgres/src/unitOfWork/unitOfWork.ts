import { Lifecycle, scoped, InjectionToken, injectable, inject } from "tsyringe";
import { DataSource, QueryRunner } from "typeorm";
import { dataSourceToken } from "../data-source";


export const unitOfWorkToken: InjectionToken = "unitOfWork";

export interface IUnitOfWork { 
	getQueryRunner(): QueryRunner;
	start(): Promise<void>;
	commit(): Promise<void>;
	rollback(): Promise<void>;
}

@scoped(Lifecycle.ResolutionScoped)
@injectable()
export class UnitOfWork implements IUnitOfWork {
	private queryRunner: QueryRunner | null;

	constructor(
		@inject(dataSourceToken) private dataSource: DataSource
	) {
		this.queryRunner = dataSource.createQueryRunner();
	}
	
	getQueryRunner(): QueryRunner {
		if(this.queryRunner === null) throw new Error("Query runner has been released. Call restart to get a new query runner.")
		return this.queryRunner;
	}
	
	async start(): Promise<void> {
		if (this.queryRunner === null) throw new Error("Query runner has been released. Call restart to get a new query runner.")
		await this.queryRunner.startTransaction();
	}

	async commit(): Promise<void> {
		if (this.queryRunner === null) throw new Error("Query runner has been released. Call restart to get a new query runner.")
		await this.queryRunner.commitTransaction();
		await this.queryRunner.release();
		this.queryRunner = null;
	}

	restart(): void {
		this.queryRunner = this.dataSource.createQueryRunner();
	}
	
	async rollback(): Promise<void> {
		if (this.queryRunner === null) throw new Error("Query runner has been released. Call restart to get a new query runner.")

		await this.queryRunner.rollbackTransaction();
		await this.queryRunner.release();
		this.queryRunner = null;
	}
}
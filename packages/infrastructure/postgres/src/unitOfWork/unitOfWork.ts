import { Lifecycle, scoped, DependencyContainer, InjectionToken } from "tsyringe";
import { DataSource, QueryRunner } from "typeorm";


export const unitOfWork: InjectionToken = "unitOfWork";

export interface IUnitOfWork { 
	getQueryRunner(): QueryRunner;
	start(): Promise<void>;
	commit(): Promise<void>;
	rollback(): Promise<void>;
}

@scoped(Lifecycle.ResolutionScoped)
export class UnitOfWork implements IUnitOfWork {
	private _queryRunner: QueryRunner;

	constructor(
		private dataSource: DataSource
	) {
		this._queryRunner = dataSource.createQueryRunner();
	}
	
	getQueryRunner(): QueryRunner {
		if(this._queryRunner === null) throw new Error("Query runner has been released. Call restart to get a new query runner.")
		return this._queryRunner;
	}
	
	async start(): Promise<void> {
		if (this._queryRunner === null) throw new Error("Query runner has been released. Call restart to get a new query runner.")
		await this._queryRunner.startTransaction();
	}

	async commit(): Promise<void> {
		if (this._queryRunner === null) throw new Error("Query runner has been released. Call restart to get a new query runner.")
		await this._queryRunner.commitTransaction();
	}

	restart(): void {
		this._queryRunner = this.dataSource.createQueryRunner();
	}	
	
	async rollback(): Promise<void> {
		await this._queryRunner.rollbackTransaction();
		await this._queryRunner.release();
		this._queryRunner = null;
	}
}
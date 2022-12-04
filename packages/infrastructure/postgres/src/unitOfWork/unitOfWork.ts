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
		dataSource: DataSource
	) {
		this._queryRunner = dataSource.createQueryRunner();
	}
	
	getQueryRunner(): QueryRunner {
		return this._queryRunner;
	}
	
	async start(): Promise<void> {
		await this._queryRunner.startTransaction();
	}

	async commit(): Promise<void> {
		await this._queryRunner.commitTransaction();
	}
	
	async rollback(): Promise<void> {
		await this._queryRunner.rollbackTransaction();
	}
}
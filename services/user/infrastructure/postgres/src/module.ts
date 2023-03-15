import {
	IAssetFactory,
	 IAssetGroupFactory,
	 IAssetGroupRepository,
	 IAssetRepository,
	 IBankAccountFactory,
	 IBankAccountRepository,
	 IJobFactory,
	 IJobRepository,
	 IStockFactory,
	 IStockRepository,
	 IUserFactory,
	 IUserRepository,
	 assetFactoryToken,
	 assetGroupFactoryToken,
	 assetGroupRepositoryToken,
	 assetRepositoryToken,
	 bankAccountFactoryToken,
	 bankAccountRepositoryToken,
	 jobFactoryToken,
	 jobRepositoryToken,
	 stockFactoryToken,
	 stockRepositoryToken,
	 userFactoryToken,
	 userRepositoryToken
} from "@finance/svc-user-domain";
import type { Module } from "@finance/lib-module-types";
import { DependencyContainer, Lifecycle } from "tsyringe";
import type { DataSource } from "typeorm";
import { AppDataSource, dataSourceToken } from "./data-source";
import { AssetFactory } from "./factories/assetFactory";
import { AssetGroupFactory } from "./factories/assetGroupFactory";
import { BankAccountFactory } from "./factories/bankAccountFactory";
import { JobFactory } from "./factories/jobFactory";
import { StockFactory } from "./factories/stockFactory";
import { UserFactory } from "./factories/userFactory";
import { AssetGroupRepository } from "./repositories/assetGroupRepository";
import { AssetRepository } from "./repositories/assetRepository";
import { BankAccountRepository } from "./repositories/bankAccountRepository";
import { JobRepository } from "./repositories/jobRepository";
import { StockRepository } from "./repositories/stockRepository";
import { UserRepository } from "./repositories/userRepository";
import { IUnitOfWork, UnitOfWork, unitOfWorkToken } from "./unitOfWork/unitOfWork";


export class PostgresInfrastructureModule implements Module {
	async init() {
		await AppDataSource.initialize();
	}

	register(container: DependencyContainer): void {
		container.register<IUnitOfWork>(unitOfWorkToken, UnitOfWork, {
			lifecycle: Lifecycle.ResolutionScoped
		});
		container.register<DataSource>(dataSourceToken, {
			useValue: AppDataSource
		});

		container.register<IUserRepository>(userRepositoryToken, UserRepository);
		container.register<IAssetGroupRepository>(assetGroupRepositoryToken, AssetGroupRepository);
		container.register<IAssetRepository>(assetRepositoryToken, AssetRepository);
		container.register<IBankAccountRepository>(bankAccountRepositoryToken, BankAccountRepository);
		container.register<IJobRepository>(jobRepositoryToken, JobRepository);
		container.register<IStockRepository>(stockRepositoryToken, StockRepository);

		container.register<IUserFactory>(userFactoryToken, UserFactory);
		container.register<IAssetGroupFactory>(assetGroupFactoryToken, AssetGroupFactory);
		container.register<IAssetFactory>(assetFactoryToken, AssetFactory);
		container.register<IBankAccountFactory>(bankAccountFactoryToken, BankAccountFactory);
		container.register<IJobFactory>(jobFactoryToken, JobFactory);
		container.register<IStockFactory>(stockFactoryToken, StockFactory);
		
	}

	async dispose() {
		await AppDataSource.destroy();
	}
}
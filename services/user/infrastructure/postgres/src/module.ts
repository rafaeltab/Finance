import { IAssetFactory, IAssetGroupFactory, IAssetGroupRepository, IAssetRepository, IBankAccountFactory, IBankAccountRepository, IJobFactory, IJobRepository, IStockFactory, IStockRepository, IUserFactory, IUserRepository, assetFactory, assetGroupFactory, assetGroupRepository, assetRepository, bankAccountFactory, bankAccountRepository, jobFactory, jobRepository, stockFactory, stockRepository, userFactory, userRepository } from "@finance/svc-user-domain";
import type { Module } from "@finance/lib-module-types";
import { DependencyContainer, Lifecycle } from "tsyringe";
import type { DataSource } from "typeorm";
import { AppDataSource, dataSource } from "./data-source";
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
		container.register<DataSource>(dataSource, {
			useValue: AppDataSource
		});

		container.register<IUserRepository>(userRepository, UserRepository);
		container.register<IAssetGroupRepository>(assetGroupRepository, AssetGroupRepository);
		container.register<IAssetRepository>(assetRepository, AssetRepository);
		container.register<IBankAccountRepository>(bankAccountRepository, BankAccountRepository);
		container.register<IJobRepository>(jobRepository, JobRepository);
		container.register<IStockRepository>(stockRepository, StockRepository);

		container.register<IUserFactory>(userFactory, UserFactory);
		container.register<IAssetGroupFactory>(assetGroupFactory, AssetGroupFactory);
		container.register<IAssetFactory>(assetFactory, AssetFactory);
		container.register<IBankAccountFactory>(bankAccountFactory, BankAccountFactory);
		container.register<IJobFactory>(jobFactory, JobFactory);
		container.register<IStockFactory>(stockFactory, StockFactory);
		
	}

	async dispose() {
		await AppDataSource.destroy();
	}
}
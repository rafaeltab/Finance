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
import { dataSourceToken, InfrastructureDataSource } from "./data-source";
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
    private dataSoure?: InfrastructureDataSource;

    async init() {
        if(this.dataSoure !== undefined) {
	    await this.dataSoure?.initialize();
        }else{
	    throw new Error("DataSource not ready yet!");
        }
    }

    register(container: DependencyContainer): void {
        container.register<IUnitOfWork>(unitOfWorkToken, UnitOfWork, {
            lifecycle: Lifecycle.ResolutionScoped
        });
        const dataSourceCreatorContainer = container.createChildContainer()
        dataSourceCreatorContainer.register<InfrastructureDataSource>("ds", InfrastructureDataSource);

        this.dataSoure = dataSourceCreatorContainer.resolve<InfrastructureDataSource>("ds");

        container.register<DataSource>(dataSourceToken, {
	    useValue: this.dataSoure
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
        await InfrastructureDataSource.destroy();
    }
}


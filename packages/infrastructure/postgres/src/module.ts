import { AppDataSource, dataSource } from "./data-source";
import { DependencyContainer } from "tsyringe";
import { Module } from "@finance/modules";
import { IUnitOfWork, UnitOfWork, unitOfWork } from "./unitOfWork/unitOfWork";
import { DataSource } from "typeorm";
import { IUserRepository, userRepository } from "@finance/domain";
import { UserRepository } from "./repositories/userRepository";


export class PostgresInfrastructureModule implements Module {
	async init() {
		await AppDataSource.initialize();
	}

	register(container: DependencyContainer): void {
		container.register<IUnitOfWork>(unitOfWork, UnitOfWork);
		container.register<DataSource>(dataSource, {
			useValue: AppDataSource
		});

		container.register<IUserRepository>(userRepository, UserRepository);
		return;
	}
}
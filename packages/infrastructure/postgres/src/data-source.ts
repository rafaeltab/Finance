import "reflect-metadata"
import { DataSource } from "typeorm"
import { entities } from "@finance/domain";
import * as migrations from "./migrations";
import { InjectionToken } from "tsyringe";

export const dataSource: InjectionToken = "DataSource";
export const AppDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "finance",
	password: "finance",
	database: "finance",
	synchronize: false,
	logging: false,
	entities: entities,
	migrations: migrations,
	subscribers: [],
})
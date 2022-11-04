import { AppDataSource } from "./data-source";

export class PostgresModule {
	async init() {
		await AppDataSource.initialize();
	}

	register() {

	}
}
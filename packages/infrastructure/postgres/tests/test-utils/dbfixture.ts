import { UnitOfWork } from "#src/unitOfWork/unitOfWork";
import { entities, User } from "@finance/domain";
import { DataSource } from "typeorm";

export type TestDataType = typeof import("./fixture/testData")

async function createTestData() {
	return await import("./fixture/testData");
}

export class DbFixture {
	private unitOfWork: UnitOfWork;
	private dataSource: DataSource;
	private testData: TestDataType;

	private constructor() { }

	async initialize() {
		this.dataSource = await createDataSource();
		this.testData = await insertTestData(this.dataSource);
		this.resetUnitOfWork();
	}

	async resetUnitOfWork() {
		if (this.unitOfWork !== null && this.unitOfWork !== undefined && this.unitOfWork.getQueryRunner().isTransactionActive === true) {
			await this.unitOfWork.rollback();
		}
		this.unitOfWork = new UnitOfWork(this.dataSource);
		await this.unitOfWork.start();
	}

	getInstance<T extends new (unitOfWork: UnitOfWork) => InstanceType<T>>(c: T): InstanceType<T> {
		return new c(this.unitOfWork);
	}

	getTestData() {
		return this.testData;
	}

	async destroy() {
		if (this.unitOfWork.getQueryRunner().isTransactionActive === true) {
			await this.unitOfWork.rollback();
		}

		await this.dataSource.destroy();
	}

	static async getInstance() {
		const fixture = new DbFixture();
		await fixture.initialize();
		return fixture;
	}
}

export async function createDataSource() {
	var dataSource = new DataSource({
		type: "postgres",
		host: "localhost",
		port: 5433,
		username: "finance-test",
		password: "finance-test",
		database: "finance-test",
		synchronize: false,
		logging: false,
		entities: entities,
		subscribers: [],
	});
	await dataSource.initialize();
	await dataSource.synchronize(true);
	return dataSource;
}

export async function insertTestData(dataSource: DataSource) {
	const testData = await createTestData();
	const userTest = await dataSource.manager.findOne(User, {
		where: {
			identity: testData.user.identity
		}
	});

	if (userTest == null) {
		for (const entityKey of Object.keys(testData.testData)) {
			for (const entity of testData.testData[entityKey]) {
				try {
					await dataSource.manager.insert(entityKey, entity);
				} catch (e) { }
			}
		}
	}

	return testData;
}
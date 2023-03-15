import { entities, User } from "@finance/svc-user-domain";
import { DataSource } from "typeorm";
import { UnitOfWork } from "#src/unitOfWork/unitOfWork";

export type TestDataType = typeof import("./fixture/testData")

async function createTestData() {
	return import("./fixture/testData");
}

export async function createDataSource() {
	const dataSource = new DataSource({
		type: "postgres",
		host: "localhost",
		port: 5433,
		username: "finance-test",
		password: "finance-test",
		database: "finance-test",
		synchronize: false,
		logging: false,
		entities,
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

	if (userTest === null) {
		for (const entityKey of Object.keys(testData.testData)) {
			const key = entityKey as keyof (typeof testData.testData);

			for (const entity of testData.testData[key]) {
				// eslint-disable-next-line no-await-in-loop
				await dataSource.manager.insert(entityKey, entity);
			}
		}
	}

	return testData;
}

export class DbFixture {
	private unitOfWork?: UnitOfWork;

	private dataSource?: DataSource;

	private testData?: TestDataType;

	async initialize() {
		this.dataSource = await createDataSource();
		this.testData = await insertTestData(this.dataSource);
		this.resetUnitOfWork();
	}

	async resetUnitOfWork() {
		if (this.unitOfWork !== null && this.unitOfWork !== undefined && this.unitOfWork.getQueryRunner().isTransactionActive === true) {
			await this.unitOfWork.rollback();
		}
		if (!this.dataSource) throw new Error("DataSource is not initialized");

		this.unitOfWork = new UnitOfWork(this.dataSource);
		await this.unitOfWork.start();
	}

	getInstance<T extends new (unitOfWork: UnitOfWork) => InstanceType<T>>(C: T): InstanceType<T> {
		if (!this.unitOfWork) throw new Error("UnitOfWork is not initialized");

		return new C(this.unitOfWork);
	}

	getTestData() {
		if (!this.testData) throw new Error("TestData is not initialized");

		return this.testData;
	}

	async destroy() {
		if (!this.unitOfWork) throw new Error("UnitOfWork is not initialized");
		if (!this.dataSource) throw new Error("DataSource is not initialized");
		
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


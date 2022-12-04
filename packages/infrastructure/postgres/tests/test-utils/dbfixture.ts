import { UnitOfWork } from "#src/unitOfWork/unitOfWork";
import { ActiveIncome, Asset, AssetGroup, AssetValue, Balance, BankAccount, entities, Job, RealEstateAsset, StockAsset, User } from "@finance/domain";
import { DataSource } from "typeorm";

async function createTestData() {
	return await import("./fixture/testData");
}

type Fixture = {
	dataSource: DataSource;
	testData: ReturnType<typeof createTestData>;
}

export async function getFixture() {
	const dataSource = createDataSource();
	await dataSource.initialize();
	const testData = await createTestData();

	var unitOfWork = new UnitOfWork(dataSource);

	await unitOfWork.start()

	for (const entityKey of Object.keys(testData.testData)) {
		for (const entity of testData.testData[entityKey]) {
			try {
				await unitOfWork.getQueryRunner().manager.insert(entityKey, entity);
			} catch (e) { }
		}
	}

	await unitOfWork.commit();
	
	return [dataSource, testData] as const;
}

export function createDataSource() {
	return new DataSource({
		type: "better-sqlite3",
		database: ":memory:",
		name: "default",
		synchronize: true,
		entities: entities,
		// logging: true
	});
}
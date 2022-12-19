import "reflect-metadata";
import { AssetFactory } from "#src/factories/assetFactory";
import { AssetGroupRepository } from "#src/repositories/assetGroupRepository";
import { AssetRepository } from "#src/repositories/assetRepository";
import { UserRepository } from "#src/repositories/userRepository";
import { Asset, IAssetFactory, IAssetGroupRepository, IAssetRepository, IUserRepository, RealEstateAsset, StockAsset } from "@finance/domain";
import { DbFixture, TestDataType } from "../test-utils/dbfixture";

let fixture: DbFixture; 
let testData: TestDataType;

let assetFactory: IAssetFactory;
let assetRepository: IAssetRepository;
let userRepository: IUserRepository;
let assetGroupRepository: IAssetGroupRepository;

beforeAll(async () => {
	fixture = await DbFixture.getInstance();
	testData = fixture.getTestData();
});

beforeEach(async () => {
	await fixture.resetUnitOfWork();

	assetFactory = fixture.getInstance(AssetFactory);
	assetRepository = fixture.getInstance(AssetRepository);
	userRepository = fixture.getInstance(UserRepository);
	assetGroupRepository = fixture.getInstance(AssetGroupRepository);
});

afterAll(async () => {
	await fixture.destroy();
});

type StockAssetData = {
	stockOrders: {amount: number, price: number}[]
}

type RealEstateAssetData = {
	address: string
}

describe("addStockToAssetGroup", () => {
	test('addStockToAssetGroup should create an entity with the given parameters and link it to an asset group', async () => {
		const data = {
			stockOrders: [{
				amount: 5,
				price: 99.3
			}]
		}

		const [stockAsset, asset] = await assetFactory.addStockToAssetGroup({
			identity: testData.assetGroup.identity
		}, {
			identity: testData.googlStockData.identity
		}, data.stockOrders);

		assetAndStockAssetValid(data, stockAsset, asset);

		const res = await assetRepository.get({
			identity: asset.identity
		});

		assetAndStockAssetValid(data, res.stockAsset, res);
		
		const assetGroup = await assetGroupRepository.get({
			uniqueId: testData.assetGroup.uniqueId
		})

		const assetGroupAsset = assetGroup.assets.find(x => x.identity === asset.identity);

		assetAndStockAssetValid(data, assetGroupAsset.stockAsset, assetGroupAsset);
	});
});

describe("addStockToUser", () => {
	test('addStockToUser should create an entity with the given parameters and link it to an asset group', async () => {
		const data = {
			stockOrders: [{
				amount: 5,
				price: 99.3
			}],
			symbol: "GOOG",
			exchange: "NASDAQ"
		}

		const [stockAsset, asset] = await assetFactory.addStockToUser({
			identity: testData.user.identity
		}, {
			identity: testData.googlStockData.identity
		}, data.stockOrders);

		assetAndStockAssetValid(data, stockAsset, asset);

		const res = await assetRepository.get({
			identity: asset.identity
		});

		assetAndStockAssetValid(data, res.stockAsset, res);

		const user = await userRepository.getRelations({
			uniqueId: testData.user.uniqueId
		}, {
			assets: {
				stockAsset: {
					orders: true
				}
			}
		})

		const userAsset = user.assets.find(x => x.identity === asset.identity);

		assetAndStockAssetValid(data, userAsset.stockAsset, userAsset);
	});
});

describe("addRealEstateToAssetGroup", () => {
	test('addRealEstateToAssetGroup should create an entity with the given parameters and link it to an asset group', async () => {
		const data = {
			address: "white street 5"
		}

		const [realEstateAsset, asset] = await assetFactory.addRealEstateToAssetGroup({
			identity: testData.assetGroup.identity
		}, data.address);

		assetAndRealEstateAssetValid(data, realEstateAsset, asset);

		const res = await assetRepository.get({
			identity: asset.identity
		});

		assetAndRealEstateAssetValid(data, res.realEstateAsset, res);

		const assetGroup = await assetGroupRepository.get({
			uniqueId: testData.assetGroup.uniqueId
		})

		const assetGroupAsset = assetGroup.assets.find(x => x.identity === asset.identity);

		assetAndRealEstateAssetValid(data, assetGroupAsset.realEstateAsset, assetGroupAsset);
	});
});

describe("addRealEstateToUser", () => {
	test('addRealEstateToUser should create an entity with the given parameters and link it to an asset group', async () => {
		const data = {
			address: "white street 5"
		}

		const [realEstateAsset, asset] = await assetFactory.addRealEstateToUser({
			identity: testData.user.identity
		}, data.address);

		assetAndRealEstateAssetValid(data, realEstateAsset, asset);

		const res = await assetRepository.get({
			identity: asset.identity
		});

		assetAndRealEstateAssetValid(data, res.realEstateAsset, res);

		const user = await userRepository.get({
			uniqueId: testData.user.uniqueId
		}, ["assets"])

		const userAsset = user.assets.find(x => x.identity === asset.identity);

		assetAndRealEstateAssetValid(data, userAsset.realEstateAsset, userAsset);
	});
});

function assetAndStockAssetValid(data: StockAssetData, stockAsset?: StockAsset, asset?: Asset) {
	expect(asset).not.toBeNull();
	expect(asset).not.toBeUndefined();
	expect(stockAsset).not.toBeNull();
	expect(stockAsset).not.toBeUndefined();

	expect(asset.uniqueId).not.toBeUndefined();
	expect(asset.uniqueId).not.toBeNull();
	expect(stockAsset.uniqueId).not.toBeUndefined();
	expect(stockAsset.uniqueId).not.toBeNull();

	expect(stockAsset.orders.length).toBe(data.stockOrders.length);
	expect(stockAsset.stockData.identity).toBe(testData.googlStockData.identity);
}

function assetAndRealEstateAssetValid(data: RealEstateAssetData, realEstateAsset?: RealEstateAsset, asset?: Asset) {
	expect(asset).not.toBeNull();
	expect(asset).not.toBeUndefined();
	expect(realEstateAsset).not.toBeNull();
	expect(realEstateAsset).not.toBeUndefined();

	expect(asset.uniqueId).not.toBeUndefined();
	expect(asset.uniqueId).not.toBeNull();
	expect(realEstateAsset.uniqueId).not.toBeUndefined();
	expect(realEstateAsset.uniqueId).not.toBeNull();

	expect(realEstateAsset.address).toBe(data.address);
}

import "reflect-metadata";
import { AssetRepository } from "#src/repositories/assetRepository";
import { v4 } from "uuid";
import { arrayIdentityEquals, identityEquals } from "../test-utils/arrayUtils";
import { DbFixture, TestDataType } from "../test-utils/dbfixture";

let fixture: DbFixture;
let testData: TestDataType;

let assetRepository: AssetRepository;

beforeAll(async () => {
	fixture = await DbFixture.getInstance();
	testData = fixture.getTestData();
});

beforeEach(async () => {
	console.log("Before")
	await fixture.resetUnitOfWork();
	assetRepository = fixture.getInstance(AssetRepository);
});

afterAll(async () => {
	console.log("After")

	await fixture.destroy();
});

describe("getAllAssetsForUser", () => {
	test('getAllAssetsForUser should return all assets for a user by its identity, with at least their uniqueIds and identities', async () => {
		const assets = await assetRepository.getAllAssetsForUser({
			identity: testData.user.identity
		}, testData.user.assets.length + 1, 0);

		expect(arrayIdentityEquals(assets.data, testData.user.assets)).toBe(true);
	});

	test('getAllAssetsForUser should return all assets for a user by its uniqueId, with at least their uniqueIds and identities', async () => {
		const assets = await assetRepository.getAllAssetsForUser({
			uniqueId: testData.user.uniqueId
		}, testData.user.assets.length + 1, 0);

		expect(arrayIdentityEquals(assets.data, testData.user.assets)).toBe(true);
	});
});

describe("getAllAssetsForAssetGroup", () => {
	test('getAllAssetsForAssetGroup should return all assets for a user by its identity, with at least their uniqueIds and identities', async () => {
		const assets = await assetRepository.getAllAssetsForAssetGroup({
			identity: testData.assetGroup.identity
		}, testData.assetGroup.assets.length + 1, 0);

		expect(arrayIdentityEquals(assets.data, testData.assetGroup.assets)).toBe(true);
	});

	test('getAllAssetsForAssetGroup should return all assets for a user by its uniqueId, with at least their uniqueIds and identities', async () => {
		const assets = await assetRepository.getAllAssetsForAssetGroup({
			uniqueId: testData.assetGroup.uniqueId
		}, testData.assetGroup.assets.length + 1, 0);

		expect(arrayIdentityEquals(assets.data, testData.assetGroup.assets)).toBe(true);
	});
});

describe("get", () => {
	test('get should return the asset identified by a uniqueId, with at the very least all identities set', async () => {
		const asset = await assetRepository.get({
			uniqueId: testData.asset.uniqueId
		});

		expect(identityEquals(asset, testData.asset)).toBe(true);
	});

	test('get should return the asset identified by a identity, with at the very least all identities set', async () => {
		const asset = await assetRepository.get({
			identity: testData.asset.identity
		});

		expect(identityEquals(asset, testData.asset)).toBe(true);
	});

	test('get should return null when no asset can be found for a given id', async () => {
		const uniqueId = v4();

		const asset = await assetRepository.get({
			uniqueId
		});

		expect(asset).toBeNull();
	});
});

describe("delete", () => {
	test('Should do nothing if no user with the given id is found', async () => {
		const uniqueId = v4();

		await assetRepository.delete({
			uniqueId
		});

		const asset = await assetRepository.get({
			uniqueId: testData.asset.uniqueId
		});

		expect(asset).not.toBeNull();
	});

	test('Should delete a user if it\'s id is provided', async () => {
		const uniqueId = testData.asset.uniqueId;

		await assetRepository.delete({
			uniqueId
		});

		const asset = await assetRepository.get({
			uniqueId
		});

		expect(asset).toBeNull();
	});
});

describe("getGranularValuesForAsset", () => {
	test('getGranularValuesForAsset should return an array of min, max, avg values for an asset in a given time range', async () => {
		const data = await assetRepository.getGranularValuesForAsset({
			uniqueId: testData.asset.uniqueId
		}, new Date(2020, 0, 1), new Date(2023, 0, 2), "day", 100, 0);

		expect(data.data.length).toBe(1);

		let expectedMin = 100000;
		let expectedMax = 0;

		for (const assetValue of testData.assetValues) {
			if (assetValue.usdValue < expectedMin) {
				expectedMin = assetValue.usdValue;
			}

			if (assetValue.usdValue > expectedMax) {
				expectedMax = assetValue.usdValue;
			}
		}


		expect(data.data[0].minValue).toBe(expectedMin.toString());
		expect(data.data[0].maxValue).toBe(expectedMax.toString());
	});
});
describe("getValuesForAsset", () => {
	test('getValuesForAsset should return an array of values for an asset in a given time range', async () => {
		const data = await assetRepository.getValuesForAsset({
			uniqueId: testData.asset.uniqueId
		}, new Date(2020, 0, 1), new Date(2023, 0, 2), testData.assetValues.length + 1, 0);

		expect(data.data.length).toBe(testData.assetValues.length);
	});
});

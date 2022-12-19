import "reflect-metadata";
import { AssetRepository } from "#src/repositories/assetRepository";
import { v4 } from "uuid";
import { arrayIdentityEquals, identityEquals } from "../test-utils/arrayUtils";
import { DbFixture, TestDataType } from "../test-utils/dbfixture";
import { IAssetRepository } from "@finance/domain";

let fixture: DbFixture;
let testData: TestDataType;

let assetRepository: IAssetRepository;

beforeAll(async () => {
	fixture = await DbFixture.getInstance();
	testData = fixture.getTestData();
});

beforeEach(async () => {
	await fixture.resetUnitOfWork();
	assetRepository = fixture.getInstance(AssetRepository);
});

afterAll(async () => {
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

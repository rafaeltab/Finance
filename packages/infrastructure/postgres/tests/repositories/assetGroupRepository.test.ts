import "reflect-metadata";
import { AssetGroupRepository } from "#src/repositories/assetGroupRepository";
import { v4 } from "uuid";
import { arrayIdentityEquals, identityEquals } from "../test-utils/arrayUtils";
import { DbFixture, TestDataType } from "../test-utils/dbfixture";

let fixture: DbFixture;
let testData: TestDataType;

let assetGroupRepository: AssetGroupRepository;

beforeAll(async () => {
	fixture = await DbFixture.getInstance();
	testData = fixture.getTestData();
});

beforeEach(async () => {
	await fixture.resetUnitOfWork();
	assetGroupRepository = fixture.getInstance(AssetGroupRepository);
});

afterAll(async () => {
	await fixture.destroy();
});

describe("getAllAssetGroupsForUser", () => {
	test('getAllAssetGroupsForUser should return all assetGroups for a user by its identity, with at least their uniqueIds and identities', async () => {
		const assetGroups = await assetGroupRepository.getAllAssetGroupsForUser({
			identity: testData.user.identity
		},testData.user.assetGroups.length + 1, 0);

		expect(arrayIdentityEquals(assetGroups.data, testData.user.assetGroups)).toBe(true);
	});

	test('getAllAssetGroupsForUser should return all assetGroups for a user by its uniqueId, with at least their uniqueIds and identities', async () => {
		const assetGroups = await assetGroupRepository.getAllAssetGroupsForUser({
			uniqueId: testData.user.uniqueId
		}, testData.user.assetGroups.length + 1, 0);

		expect(arrayIdentityEquals(assetGroups.data, testData.user.assetGroups)).toBe(true);
	});
});

describe("get", () => {
	test('get should return the assetGroup identified by a uniqueId, with at the very least all identities set', async () => {
		const assetGroup = await assetGroupRepository.get({
			uniqueId: testData.assetGroup.uniqueId
		});

		expect(identityEquals(assetGroup, testData.assetGroup)).toBe(true);
	});

	test('get should return the assetGroup identified by a identity, with at the very least all identities set', async () => {
		const assetGroup = await assetGroupRepository.get({
			identity: testData.assetGroup.identity
		});

		expect(identityEquals(assetGroup, testData.assetGroup)).toBe(true);
	});

	test('get should return null when no assetGroup can be found for a given id', async () => {
		const uniqueId = v4();

		const assetGroup = await assetGroupRepository.get({
			uniqueId
		});

		expect(assetGroup).toBeNull();
	});
});

describe("delete", () => {
	test('Should do nothing if no user with the given id is found', async () => {
		const uniqueId = v4();

		await assetGroupRepository.delete({
			uniqueId
		});

		const assetGroup = await assetGroupRepository.get({
			uniqueId: testData.assetGroup.uniqueId
		});

		expect(assetGroup).not.toBeNull();
	});

	test('Should delete a user if it\'s id is provided', async () => {
		const uniqueId = testData.assetGroup.uniqueId;

		await assetGroupRepository.delete({
			uniqueId
		});

		const assetGroup = await assetGroupRepository.get({
			uniqueId
		});

		expect(assetGroup).toBeNull();
	});
});

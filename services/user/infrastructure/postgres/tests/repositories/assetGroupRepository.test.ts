import "reflect-metadata";
import { v4 } from "uuid";
import type { IAssetGroupRepository } from "@finance/svc-user-domain";
import { AssetGroupRepository } from "#src/repositories/assetGroupRepository";
import { arrayIdentityEquals, identityEquals } from "../test-utils/arrayUtils";
import { DbFixture, TestDataType } from "../test-utils/dbfixture";

let fixture: DbFixture;
let testData: TestDataType;

let assetGroupRepository: IAssetGroupRepository;

beforeAll(async () => {
	fixture = await DbFixture.getInstance();
	testData = fixture.getTestData();
}, 20000);

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
		},testData.user.assetGroups!.length + 1, 0);

		expect(arrayIdentityEquals(assetGroups.data, testData.user.assetGroups!)).toBe(true);
	});

	test('getAllAssetGroupsForUser should return all assetGroups for a user by its uniqueId, with at least their uniqueIds and identities', async () => {
		const assetGroups = await assetGroupRepository.getAllAssetGroupsForUser({
			uniqueId: testData.user.uniqueId
		}, testData.user.assetGroups!.length + 1, 0);

		expect(arrayIdentityEquals(assetGroups.data, testData.user.assetGroups!)).toBe(true);
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

	test('get should throw when no assetGroup can be found for a given id', async () => {
		const uniqueId = v4();

		expect(async () => {
			await assetGroupRepository.get({
				uniqueId
			});
		}).rejects.toThrow();
	});
});

describe("delete", () => {
	test('Should throw if no user with the given id is found', async () => {
		const uniqueId = v4();

		expect(async () => {
			await assetGroupRepository.delete({
				uniqueId
			});
		}).rejects.toThrow();
	});

	test('Should delete a user if it\'s id is provided', async () => {
		const {uniqueId} = testData.assetGroup;

		await assetGroupRepository.delete({
			uniqueId
		});

		expect(async () => {
			await assetGroupRepository.get({
				uniqueId
			});
		}).rejects.toThrow();
	});
});

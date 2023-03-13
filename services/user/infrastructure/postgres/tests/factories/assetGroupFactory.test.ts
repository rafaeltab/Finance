import "reflect-metadata";
import type { IAssetGroupFactory, IAssetGroupRepository, IUserRepository } from "@finance/svc-user-domain";
import { AssetGroupFactory } from "#src/factories/assetGroupFactory";
import { AssetGroupRepository } from "#src/repositories/assetGroupRepository";
import { UserRepository } from "#src/repositories/userRepository";
import { DbFixture, TestDataType } from "../test-utils/dbfixture";
import { expectNotNullOrUndefined, expectRequiredProps } from "#tests/test-utils/expectUtils";

let fixture: DbFixture;
let testData: TestDataType;

let assetGroupFactory: IAssetGroupFactory;
let assetGroupRepository: IAssetGroupRepository;
let userRepository: IUserRepository;

beforeAll(async () => {
	fixture = await DbFixture.getInstance();
	testData = fixture.getTestData();
}, 20000);

beforeEach(async () => {
	await fixture.resetUnitOfWork();
	assetGroupFactory = fixture.getInstance(AssetGroupFactory);
	assetGroupRepository = fixture.getInstance(AssetGroupRepository);
	userRepository = fixture.getInstance(UserRepository);
	
});

afterAll(async () => {
	await fixture.destroy();
});

describe("addAssetGroupToUser", () => {
	test('addAssetGroupToUser should create an entity with the given parameters and link it to a user', async () => {
		const data = {
			name: "cool"
		}

		const assetGroup = await assetGroupFactory.addAssetGroupToUser({
			identity: testData.user.identity
		}, data.name);

		expectNotNullOrUndefined(assetGroup)
		expectRequiredProps(assetGroup, ["uniqueId", "name"]);

		expect(assetGroup.name).toBe(data.name);

		const res = await assetGroupRepository.get({
			identity: assetGroup.identity
		});

		expectNotNullOrUndefined(res)
		expectRequiredProps(res, ["uniqueId", "name"]);

		expect(res.name).toBe(data.name);

		const user = await userRepository.get({
			uniqueId: testData.user.uniqueId
		}, ["assetGroups"])

		expectRequiredProps(user, ["assetGroups"]);

		const userAssetGroup = user.assetGroups!.find(x => x.identity === assetGroup.identity);

		expectNotNullOrUndefined(userAssetGroup)
		expectRequiredProps(userAssetGroup, ["uniqueId"]);

		expect(userAssetGroup!.uniqueId).toBe(res.uniqueId);
	});
});

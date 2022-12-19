import "reflect-metadata";
import { AssetGroupFactory } from "#src/factories/assetGroupFactory";
import { AssetGroupRepository } from "#src/repositories/assetGroupRepository";
import { UserRepository } from "#src/repositories/userRepository";
import { DbFixture, TestDataType } from "../test-utils/dbfixture";
import { IAssetGroupFactory, IAssetGroupRepository, IUserRepository } from "@finance/domain";

let fixture: DbFixture;
let testData: TestDataType;

let assetGroupFactory: IAssetGroupFactory;
let assetGroupRepository: IAssetGroupRepository;
let userRepository: IUserRepository;

beforeAll(async () => {
	fixture = await DbFixture.getInstance();
	testData = fixture.getTestData();
});

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

		expect(assetGroup).not.toBeNull();
		expect(assetGroup).not.toBeUndefined();

		expect(assetGroup.uniqueId).not.toBeUndefined();
		expect(assetGroup.uniqueId).not.toBeNull();

		expect(assetGroup.name).toBe(data.name);

		const res = await assetGroupRepository.get({
			identity: assetGroup.identity
		});

		expect(res).not.toBeNull();
		expect(res).not.toBeUndefined();

		expect(res.uniqueId).not.toBeUndefined();
		expect(res.uniqueId).not.toBeNull();

		expect(res.name).toBe(data.name);

		const user = await userRepository.get({
			uniqueId: testData.user.uniqueId
		}, ["assetGroups"])

		const userAssetGroup = user.assetGroups.find(x => x.identity === assetGroup.identity);

		expect(userAssetGroup).not.toBeUndefined();
		expect(userAssetGroup).not.toBeNull();
		expect(userAssetGroup.uniqueId).toBe(res.uniqueId);
	});
});

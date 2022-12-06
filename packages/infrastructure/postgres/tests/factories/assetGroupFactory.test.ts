import "reflect-metadata";
import { AssetGroupFactory } from "#src/factories/assetGroupFactory";
import { AssetGroupRepository } from "#src/repositories/assetGroupRepository";
import { UnitOfWork } from "#src/unitOfWork/unitOfWork";
import { getFixture } from "../test-utils/dbfixture";
import { UserRepository } from "#src/repositories/userRepository";
AssetGroupFactory
let assetGroupFactory: AssetGroupFactory;
let assetGroupRepository: AssetGroupRepository;
let userRepository: UserRepository;
let unitOfWork: UnitOfWork;

let testData: typeof import("d:/ShitsNGiggles/SoftwareEngineering/Typescript/finance/packages/infrastructure/postgres/tests/test-utils/fixture/testData");

beforeEach(async () => {
	const fixture = await getFixture()

	unitOfWork = new UnitOfWork(fixture[0]);

	assetGroupFactory = new AssetGroupFactory(unitOfWork);
	assetGroupRepository = new AssetGroupRepository(unitOfWork);
	userRepository = new UserRepository(unitOfWork);
	
	testData = fixture[1];
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

import { UserRepository } from "#src/repositories/userRepository";
import { UnitOfWork } from "#src/unitOfWork/unitOfWork";
import { arrayIdentityEquals, identityEquals } from "../test-utils/arrayUtils";
import { getFixture } from "../test-utils/dbfixture";
import { v4 } from "uuid";

let userRepository: UserRepository;
let testData: typeof import("d:/ShitsNGiggles/SoftwareEngineering/Typescript/finance/packages/infrastructure/postgres/tests/test-utils/fixture/testData");

beforeEach(async () => {
	const fixture = await getFixture()

	userRepository = new UserRepository(new UnitOfWork(fixture[0]));
	testData = fixture[1];
});

describe("getAll", () => {
	test('getAll should return all users, with at least their uniqueId and identity', async () => {
		const users = await userRepository.getAll(testData.testData.User.length + 1, 0);

		expect(arrayIdentityEquals(users.data, testData.testData.User)).toBe(true);
	});

	test('getAll should return resolve foreign keys when requested', async () => {
		const users = await userRepository.getAll(testData.testData.User.length + 1, 0, ["bankAccounts"]);

		expect(arrayIdentityEquals(users.data, testData.testData.User)).toBe(true);
		for (const user of users.data) {
			const expectedBankAccounts = testData.testData.User.find(x => x.uniqueId == user.uniqueId).bankAccounts;

			expect(arrayIdentityEquals(user.bankAccounts, expectedBankAccounts)).toBe(true);
		}
	});
});

describe("get", () => {
	test('get should return the user identified by a uniqueId, with at the very least all identities set', async () => {
		const uniqueId = testData.user.uniqueId;

		const user = await userRepository.get({
			uniqueId
		});

		expect(identityEquals(user, testData.user)).toBe(true);
	});

	test('get should return the user identified by a identity, with at the very least all identities set', async () => {
		const identity = testData.user.identity;

		const user = await userRepository.get({
			identity
		});

		expect(identityEquals(user, testData.user)).toBe(true);
	});

	test('get should return null when no user can be found for a given id', async () => {
		const uniqueId = v4();

		const user = await userRepository.get({
			uniqueId
		});

		expect(user).toBeNull();
	});
});

describe("delete", () => {
	test('Should do nothing if no user with the given id is found', async () => {
		const uniqueId = v4();

		await userRepository.delete({
			uniqueId
		});

		const user = await userRepository.get({
			uniqueId: testData.user.uniqueId
		});

		expect(user).not.toBeNull();
	});

	test('Should delete a user if it\'s id is provided', async () => {
		const uniqueId = testData.user.uniqueId;

		await userRepository.delete({
			uniqueId
		});

		const user = await userRepository.get({
			uniqueId
		});

		expect(user).toBeNull();
	});
});

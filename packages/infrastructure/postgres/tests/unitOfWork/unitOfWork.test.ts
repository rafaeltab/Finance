import "reflect-metadata";
import { UserFactory } from "#src/factories/userFactory";
import { UserRepository } from "#src/repositories/userRepository";
import { UnitOfWork } from "#src/unitOfWork/unitOfWork";
import { getFixture } from "../test-utils/dbfixture";

let userFactory: UserFactory;
let userRepository: UserRepository;
let unitOfWork: UnitOfWork;
let testData: typeof import("d:/ShitsNGiggles/SoftwareEngineering/Typescript/finance/packages/infrastructure/postgres/tests/test-utils/fixture/testData");

beforeEach(async () => {
	const fixture = await getFixture()

	unitOfWork = new UnitOfWork(fixture[0]);

	userFactory = new UserFactory(unitOfWork);
	userRepository = new UserRepository(unitOfWork);
	testData = fixture[1];
});

describe("unitOfWork", () => {
	test('unitOfWork should commit the transaction when commit is called', async () => {
		await unitOfWork.start();
		const data = {
			identity: "test-user",
			firstName: "Test",
			lastName: "User",
			age: 20
		}

		const user = await userFactory.createUser(data.identity, data.firstName, data.lastName, data.age);

		expect(user).not.toBeNull();
		expect(user).not.toBeUndefined();

		expect(user.uniqueId).not.toBeUndefined();
		expect(user.uniqueId).not.toBeNull();

		expect(user.identity).toBe(data.identity);
		expect(user.firstName).toBe(data.firstName);
		expect(user.lastName).toBe(data.lastName);
		expect(user.age).toBe(data.age);

		await unitOfWork.commit();

		const res = await userRepository.get({
			identity: data.identity
		});

		expect(res).not.toBeNull();
		expect(res).not.toBeUndefined();

		expect(res.uniqueId).not.toBeUndefined();
		expect(res.uniqueId).not.toBeNull();

		expect(res.identity).toBe(data.identity);
		expect(res.firstName).toBe(data.firstName);
		expect(res.lastName).toBe(data.lastName);
		expect(res.age).toBe(data.age);
	});

	test('unitOfWork should rollback the transaction when rollback is called', async () => {
		await unitOfWork.start();
		const data = {
			identity: "test-user",
			firstName: "Test",
			lastName: "User",
			age: 20
		}

		const user = await userFactory.createUser(data.identity, data.firstName, data.lastName, data.age);

		expect(user).not.toBeNull();
		expect(user).not.toBeUndefined();

		expect(user.uniqueId).not.toBeUndefined();
		expect(user.uniqueId).not.toBeNull();

		expect(user.identity).toBe(data.identity);
		expect(user.firstName).toBe(data.firstName);
		expect(user.lastName).toBe(data.lastName);
		expect(user.age).toBe(data.age);

		await unitOfWork.rollback();

		const res = await userRepository.get({
			identity: data.identity
		});

		expect(res).toBeNull();
	});
});

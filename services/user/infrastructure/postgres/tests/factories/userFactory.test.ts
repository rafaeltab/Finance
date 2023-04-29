import "reflect-metadata";
import type { IUserFactory, IUserRepository } from "@finance/svc-user-domain";
import { UserFactory } from "#src/factories/userFactory";
import { UserRepository } from "#src/repositories/userRepository";
import { DbFixture } from "../test-utils/dbfixture";
import { expectNotNullOrUndefined, expectRequiredProps } from "#tests/test-utils/expectUtils";

let fixture: DbFixture;

let userFactory: IUserFactory;
let userRepository: IUserRepository;

beforeAll(async () => {
    fixture = await DbFixture.getInstance();
}, 20000);

beforeEach(async () => {
    await fixture.resetUnitOfWork();
    userFactory = fixture.getInstance(UserFactory);
    userRepository = fixture.getInstance(UserRepository);
});

afterAll(async () => {
    await fixture.destroy();
});

describe("createUser", () => {
    test('createUser should create an entity with the given parameters', async () => {
        const data = {
            identity: "test-user",
            firstName: "Test",
            lastName: "User",
            dateOfBirth: new Date("2004-09-25"),
        }

        const user = await userFactory.createUser(data.identity, data.firstName, data.lastName, data.dateOfBirth);

        expectNotNullOrUndefined(user);
        expectRequiredProps(user, ["uniqueId", "identity", "firstName", "lastName", "dateOfBirth"]);

        expect(user.identity).toBe(data.identity);
        expect(user.firstName).toBe(data.firstName);
        expect(user.lastName).toBe(data.lastName);
        expect(user.dateOfBirth).toStrictEqual(data.dateOfBirth);

        const res = await userRepository.get({
            identity: data.identity
        });

        expectNotNullOrUndefined(res);
        expectRequiredProps(res, ["uniqueId", "identity", "firstName", "lastName", "dateOfBirth"]);

        expect(res.identity).toBe(data.identity);
        expect(res.firstName).toBe(data.firstName);
        expect(res.lastName).toBe(data.lastName);
        expect(res.dateOfBirth).toStrictEqual(data.dateOfBirth);
    });
});

import "reflect-metadata";
import { BankAccountRepository } from "#src/repositories/bankAccountRepository";
import { v4 } from "uuid";
import { arrayIdentityEquals, identityEquals } from "../test-utils/arrayUtils";
import { DbFixture, TestDataType } from "../test-utils/dbfixture";

let fixture: DbFixture;
let testData: TestDataType;

let bankAccountRepository: BankAccountRepository;

beforeAll(async () => {
	fixture = await DbFixture.getInstance();
	testData = fixture.getTestData();
});

beforeEach(async () => {
	await fixture.resetUnitOfWork();
	bankAccountRepository = fixture.getInstance(BankAccountRepository);
});

afterAll(async () => {
	await fixture.destroy();
});

describe("getAllBankAccountsForUser", () => {
	test('getAllBankAccountsForUser should return all bankAccounts for a user by its identity, with at least their uniqueIds and identities', async () => {
		const bankAccounts = await bankAccountRepository.getAllBankAccountsForUser({
			identity: testData.user.identity
		},testData.user.bankAccounts.length + 1, 0);

		expect(arrayIdentityEquals(bankAccounts.data, testData.user.bankAccounts)).toBe(true);
	});

	test('getAllBankAccountsForUser should return all bankAccounts for a user by its uniqueId, with at least their uniqueIds and identities', async () => {
		const bankAccounts = await bankAccountRepository.getAllBankAccountsForUser({
			uniqueId: testData.user.uniqueId
		}, testData.user.bankAccounts.length + 1, 0);

		expect(arrayIdentityEquals(bankAccounts.data, testData.user.bankAccounts)).toBe(true);
	});
});

describe("get", () => {
	test('get should return the bankAccount identified by a uniqueId, with at the very least all identities set', async () => {
		const bankAccount = await bankAccountRepository.get({
			uniqueId: testData.bankAccount.uniqueId
		});

		expect(identityEquals(bankAccount, testData.bankAccount)).toBe(true);
	});

	test('get should return the bankAccount identified by a identity, with at the very least all identities set', async () => {
		const bankAccount = await bankAccountRepository.get({
			identity: testData.bankAccount.identity
		});

		expect(identityEquals(bankAccount, testData.bankAccount)).toBe(true);
	});

	test('get should return null when no bankAccount can be found for a given id', async () => {
		const uniqueId = v4();

		const bankAccount = await bankAccountRepository.get({
			uniqueId
		});

		expect(bankAccount).toBeNull();
	});
});

describe("delete", () => {
	test('Should do nothing if no user with the given id is found', async () => {
		const uniqueId = v4();

		await bankAccountRepository.delete({
			uniqueId
		});

		const bankAccount = await bankAccountRepository.get({
			uniqueId: testData.bankAccount.uniqueId
		});

		expect(bankAccount).not.toBeNull();
	});

	test('Should delete a user if it\'s id is provided', async () => {
		const uniqueId = testData.bankAccount.uniqueId;

		await bankAccountRepository.delete({
			uniqueId
		});

		const bankAccount = await bankAccountRepository.get({
			uniqueId
		});

		expect(bankAccount).toBeNull();
	});
});

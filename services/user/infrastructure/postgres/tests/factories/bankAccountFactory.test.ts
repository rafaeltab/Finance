import "reflect-metadata";
import type { IBankAccountFactory, IBankAccountRepository, IUserRepository } from "@finance/svc-user-domain";
import { BankAccountFactory } from "#src/factories/bankAccountFactory";
import { BankAccountRepository } from "#src/repositories/bankAccountRepository";
import { UserRepository } from "#src/repositories/userRepository";
import { DbFixture, TestDataType } from "../test-utils/dbfixture";
import { expectNotNullOrUndefined, expectRequiredProps } from "#tests/test-utils/expectUtils";

let fixture: DbFixture;
let testData: TestDataType;

let bankAccountFactory: IBankAccountFactory;
let bankAccountRepository: IBankAccountRepository;
let userRepository: IUserRepository;


beforeAll(async () => {
    fixture = await DbFixture.getInstance();
    testData = fixture.getTestData();
}, 20000);

beforeEach(async () => {
    await fixture.resetUnitOfWork();
    bankAccountFactory = fixture.getInstance(BankAccountFactory);
    bankAccountRepository = fixture.getInstance(BankAccountRepository);
    userRepository = fixture.getInstance(UserRepository);
	
});

afterAll(async () => {
    await fixture.destroy();
});

describe("addBankAccountToUser", () => {
    test('addBankAccountToUser should create an entity with the given parameters and link it to a user', async () => {
        const data = {
            bank: "ing",
            balance: 5,
            currency: "EUR"
        }

        const bankAccount = await bankAccountFactory.addBankAccountToUser({
            identity: testData.user.identity
        }, data.bank, data.balance, data.currency);

        expectNotNullOrUndefined(bankAccount);
        expectRequiredProps(bankAccount, ["uniqueId", "identity", "bank", "balance"]);

        expect(bankAccount.bank).toBe(data.bank);
        expect(bankAccount.balance.amount).toBe(data.balance);
        expect(bankAccount.balance.currency).toBe(data.currency);

        const res = await bankAccountRepository.get({
            identity: bankAccount.identity
        });

        expectNotNullOrUndefined(res);
        expectRequiredProps(res, ["uniqueId", "identity", "bank", "balance"]);

        expect(res.bank).toBe(data.bank);
        expect(res.balance.amount).toBe(data.balance);
        expect(res.balance.currency).toBe(data.currency);

        const user = await userRepository.get({
            uniqueId: testData.user.uniqueId
        }, ["bankAccounts"])

        expectRequiredProps(user, ["bankAccounts"]);

        const userBankAccount = user.bankAccounts.find(x => x.identity === bankAccount.identity);

        expectNotNullOrUndefined(userBankAccount);

        expect(userBankAccount).not.toBeUndefined();
        expect(userBankAccount).not.toBeNull();
        expect(userBankAccount.uniqueId).toBe(res.uniqueId);
    });
});

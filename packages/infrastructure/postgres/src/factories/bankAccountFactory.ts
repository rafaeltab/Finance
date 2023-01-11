import { UnitOfWork, unitOfWork } from "../unitOfWork/unitOfWork";
import { Balance, BankAccount, EntityKey, IBankAccountFactory, User, getKey } from "@finance/domain";
import { DuplicateEntryError, EntryNotFoundError, UnexpectedError } from "@finance/errors";
import { assertContains } from "@finance/libs-types";
import { inject, injectable } from "tsyringe";

@injectable()
export class BankAccountFactory implements IBankAccountFactory {

	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }

	async addBankAccountToUser(user: EntityKey, bank: string, balance: number, currency: string): Promise<BankAccount> {
		const userEntity = await this._unitOfWork.getQueryRunner().manager.findOne(User, {
			where: user,
			relations: {
				bankAccounts: true,
			}
		});

		if (!userEntity) {
			throw new EntryNotFoundError(User.name, getKey(user));
		}

		const identity = this.createIdentity(userEntity, bank);

		const existingBankAccount = await this._unitOfWork.getQueryRunner().manager.findOne(BankAccount, {
			where: {
				identity
			}
		});

		if (existingBankAccount != null) {
			throw new DuplicateEntryError(BankAccount.name, identity);
		}

		const balanceEntity = new Balance({
			amount: balance,
			currency: currency,
		});

		const bankAccount = new BankAccount({
			bank: bank,
			balance: balanceEntity,
			identity: identity
		})

		if (userEntity.bankAccounts === null) {
			throw new UnexpectedError(new Error("Bank accounts not loaded"));
		}

		assertContains(userEntity, ["bankAccounts"]);

		userEntity.bankAccounts.push(bankAccount);

		await this._unitOfWork.getQueryRunner().manager.save([bankAccount, userEntity]);

		return bankAccount;
	} 

	private createIdentity(user: User, bank: string): string {
		return `${user.identity}-bank-${bank.toLowerCase()}`;
	}
}
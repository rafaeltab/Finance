import { UnitOfWork, unitOfWork } from "#src/unitOfWork/unitOfWork";
import { Balance, BankAccount, EntityKey, IBankAccountFactory, User } from "@finance/domain";
import { inject } from "tsyringe";

export class BankAccountFactory implements IBankAccountFactory {

	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }

	async addBankAccountToUser(user: EntityKey, bank: string, balance: number, currency: string): Promise<BankAccount> {
		const userEntity = await this._unitOfWork.getQueryRunner().manager.findOne(User, {
			where: user,
			relations: {
				bankAccounts: true,
			}
		});

		const balanceEntity = new Balance({
			amount: balance,
			currency: currency,
		});

		const bankAccount = new BankAccount({
			bank: bank,
			balance: balanceEntity,
			identity: this.createIdentity(userEntity, bank)
		})

		userEntity.bankAccounts.push(bankAccount);

		await this._unitOfWork.getQueryRunner().manager.save([bankAccount, userEntity]);

		return bankAccount;
	} 

	private createIdentity(user: User, bank: string): string {
		return `${user.identity}-bank-${bank.toLowerCase()}`;
	}
}
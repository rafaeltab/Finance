import { unitOfWork, UnitOfWork } from "../unitOfWork/unitOfWork";
import { EntityKey, IBankAccountRepository, PaginatedBase, BankAccount } from "@finance/domain";
import { inject, injectable } from "tsyringe";

@injectable()
export class BankAccountRepository implements IBankAccountRepository {
	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }

	async getAllBankAccountsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<BankAccount>> {
		const res = await this._unitOfWork.getQueryRunner().manager.findAndCount(BankAccount, {
			where: {
				user: user
			},
			skip: offset,
			take: limit,
		});

		return {
			page: {
				count: limit,
				offset: offset,
				total: res[1]
			},
			data: res[0]
		}
	}

	async get(id: EntityKey): Promise<BankAccount> {
		const bankAccount =  await this._unitOfWork.getQueryRunner().manager.findOne(BankAccount, {
			where: id
		});

		if (!bankAccount) {
			throw new Error("Bank account not found");
		}

		return bankAccount;
	}

	async delete(id: EntityKey): Promise<void> {
		await this._unitOfWork.getQueryRunner().manager.delete(BankAccount, id);
	}
}
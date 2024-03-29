import { BankAccount, EntityKey, IBankAccountRepository, PaginatedBase, getKey } from "@finance/svc-user-domain";
import { EntryNotFoundError } from "@finance/lib-errors";
import { inject, injectable } from "tsyringe";
import { UnitOfWork, unitOfWorkToken } from "../unitOfWork/unitOfWork";

@injectable()
export class BankAccountRepository implements IBankAccountRepository {
	constructor(@inject(unitOfWorkToken) private unitOfWork: UnitOfWork) { }

	async getAllBankAccountsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<BankAccount>> {
		const res = await this.unitOfWork.getQueryRunner().manager.findAndCount(BankAccount, {
			where: {
				user
			},
			skip: offset,
			take: limit,
		});

		return {
			page: {
				count: limit,
				offset,
				total: res[1]
			},
			data: res[0]
		}
	}

	async get(id: EntityKey): Promise<BankAccount> {
		const bankAccount =  await this.unitOfWork.getQueryRunner().manager.findOne(BankAccount, {
			where: id
		});

		if (!bankAccount) {
			throw new EntryNotFoundError(BankAccount.name, getKey(id));
		}

		return bankAccount;
	}

	async delete(id: EntityKey): Promise<void> {
		const res = await this.unitOfWork.getQueryRunner().manager.delete(BankAccount, id);
		if ((res.affected ?? 0)===0) {
			throw new EntryNotFoundError(BankAccount.name, getKey(id));
		}
	}
}
// list a maximum of 30 asset groups

import { IBankAccountRepository, BankAccount, PaginatedBase, bankAccountRepository } from "@finance/domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/libs-types";
import { inject, injectable } from "tsyringe";

type ResponseType = IQueryResult<PaginatedBase<BankAccount>>

export class BankAccountViewQuery extends IQuery<BankAccountViewQuery, ResponseType> {
	token = "BankAccountViewQuery";
	userIdentity!: string;

	limit: number = 30;
	offset: number = 0;
}

@injectable()
export class BankAccountViewQueryHandler extends IQueryHandler<BankAccountViewQuery, ResponseType> {
	/**
	 *
	 */
	constructor(@inject(bankAccountRepository) private bankAccountRepository: IBankAccountRepository) {
		super();

	}

	async handle(query: BankAccountViewQuery): Promise<ResponseType> {
		const bankAccounts = await this.bankAccountRepository.getAllBankAccountsForUser({
			identity: query.userIdentity,
		}, query.limit, query.offset);

		return {
			success: true,
			data: {
				page: {
					count: bankAccounts.page.count,
					offset: bankAccounts.page.offset,
					total: bankAccounts.page.total,
				},
				data: bankAccounts.data
			}
		}
	}
}
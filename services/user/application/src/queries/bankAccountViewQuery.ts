// list a maximum of 30 asset groups

import { IBankAccountRepository, BankAccount, PaginatedBase, bankAccountRepository } from "@finance/svc-user-domain";
import { IQuery, IQueryHandler, IQueryResult, ISuccessQueryResult } from "@finance/lib-mediator";
import { unitOfWork, type IUnitOfWork } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = IQueryResult<PaginatedBase<BankAccount>>

export class Response implements ISuccessQueryResult<PaginatedBase<BankAccount>> {
	success!: true;
	data!: PaginatedBase<BankAccount>;
}


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
	constructor(
		@inject(bankAccountRepository) private bankAccountRepository: IBankAccountRepository,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(query: BankAccountViewQuery): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const bankAccounts = await this.bankAccountRepository.getAllBankAccountsForUser({
				identity: query.userIdentity,
			}, query.limit, query.offset);

			await this.unitOfWork.commit();

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
		} catch (e: unknown) {
			await this.unitOfWork.rollback();
			throw e;
		}
	}
}
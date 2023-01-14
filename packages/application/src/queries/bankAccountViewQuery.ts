// list a maximum of 30 asset groups

import { IBankAccountRepository, BankAccount, PaginatedBase, bankAccountRepository } from "@finance/domain";
import { IQuery, IQueryHandler, IQueryResult, ISuccessQueryResult } from "@finance/libs-types";
import { unitOfWork, type IUnitOfWork } from "@finance/postgres";
import type { JSONSchemaType } from "ajv";
import { inject, injectable } from "tsyringe";

export type ResponseType = IQueryResult<PaginatedBase<BankAccount>>



export const bankAccountResponseSchema: JSONSchemaType<ResponseType> = {
	type: "object",
	properties: {
		data: {
			type: "object",
			properties: {
				page: {
					type: "object",
					properties: {
						count: {
							type: "number",
							nullable: false
						},
						offset: {
							type: "number",
							nullable: false
						},
						total: {
							type: "number",
							nullable: false
						},
					},
					required: ["count", "offset", "total"]
				},
				data: {
					type: "array",
					items: {
						type: "object",
						properties: {
							uniqueId: {
								type: "string",
								nullable: true
							},
							identity: {
								type: "string",
								nullable: true
							},
							balance: {
								type: "object",
								properties: {
									amount: {
										type: "number",
										nullable: false
									},
									bankAccount: {
										type: "string",
										nullable: true
									}
								}
							},
							bank: {
								type: "string",
								nullable: true
							},
							user: {
								type: "string",
								nullable: true
							},
						},
						required: ["uniqueId", "identity", "balance", "bank", "user"]
					}
				}
			},
			required: ["data", "page"]

		},
		success: {
			type: "boolean",
			const: true,
			nullable: false
		}
	},
	required: ["data", "success"]
}

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
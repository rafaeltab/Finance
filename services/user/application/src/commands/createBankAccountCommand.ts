// list a maximum of 30 asset groups

import { IBankAccountFactory, BankAccount, bankAccountFactory } from "@finance/svc-user-domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWork } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<BankAccount>;

export class CreateBankAccountCommand extends ICommand<CreateBankAccountCommand, ResponseType> {
	token = "CreateBankAccountCommand";
	userIdentity!: string;
	bank!: string;
	balance!: number;
	currrency!: string;
}

@injectable()
export class CreateBankAccountCommandHandler extends ICommandHandler<CreateBankAccountCommand, ResponseType> {
	constructor(
		@inject(bankAccountFactory) private bankAccountFactory: IBankAccountFactory,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(command: CreateBankAccountCommand): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const bankAccount = await this.bankAccountFactory.addBankAccountToUser({
				identity: command.userIdentity,
			}, command.bank, command.balance, command.currrency);

			await this.unitOfWork.commit();

			return {
				success: true,
				data: bankAccount
			}
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
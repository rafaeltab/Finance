// list a maximum of 30 asset groups

import { IBankAccountRepository, bankAccountRepositoryToken } from "@finance/svc-user-domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWorkToken } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<undefined>;

export class DeleteBankAccountCommand extends ICommand<DeleteBankAccountCommand, ResponseType> {
    token = "DeleteBankAccountCommand";

    bankAccountIdentity!: string;
}

@injectable()
export class DeleteBankAccountCommandHandler extends ICommandHandler<DeleteBankAccountCommand, ResponseType> {
    constructor(
		@inject(bankAccountRepositoryToken) private bankAccountRepository: IBankAccountRepository,
		@inject(unitOfWorkToken) private unitOfWork: IUnitOfWork
    ) {
        super();
    }

    async handle(command: DeleteBankAccountCommand): Promise<ResponseType> {
        try {
            await this.unitOfWork.start();

            await this.bankAccountRepository.delete({
                identity: command.bankAccountIdentity
            });

            await this.unitOfWork.commit();

            return {
                success: true,
                data: undefined
            }
        } catch (error) {
            await this.unitOfWork.rollback();
            throw error;
        }
    }
}
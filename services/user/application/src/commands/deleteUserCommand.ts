// list a maximum of 30 asset groups

import { IUserRepository, userRepository } from "@finance/svc-user-domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWork } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<undefined>;

export class DeleteUserCommand extends ICommand<DeleteUserCommand, ResponseType> {
	token = "DeleteUserCommand";
	userIdentity!: string;
}

@injectable()
export class DeleteUserCommandHandler extends ICommandHandler<DeleteUserCommand, ResponseType> {
	constructor(
		@inject(userRepository) private userRepository: IUserRepository,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(command: DeleteUserCommand): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			await this.userRepository.delete({
				identity: command.userIdentity
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
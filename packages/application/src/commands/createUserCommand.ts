// list a maximum of 30 asset groups

import { IUserFactory, userFactory } from "@finance/domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/libs-types";
import { IUnitOfWork, unitOfWork } from "@finance/postgres";
import { inject, injectable } from "tsyringe";

type ResponseType = ICommandResult<{
	userIdentity: string;
}>;

export class CreateUserCommand extends ICommand<CreateUserCommand, ResponseType> {
	token = "CreateUserCommand";
	firstName!: string;
	lastName!: string;
	dateOfBirth!: Date;
}

@injectable()
export class CreateUserCommandHandler extends ICommandHandler<CreateUserCommand, ResponseType> {
	constructor(
		@inject(userFactory) private userFactory: IUserFactory,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(command: CreateUserCommand): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const user = await this.userFactory.createUser(`user-${command.firstName}-${command.lastName}-${command.dateOfBirth}`,
				command.firstName,
				command.lastName,
				command.dateOfBirth);

			await this.unitOfWork.commit();

			return {
				success: true,
				data: {
					userIdentity: user.identity
				}
			}
		} catch (error) {
			await this.unitOfWork.rollback();

			if (error instanceof Error) {
				return {
					success: false,
					message: error.message,
					httpCode: 500
				}
			}

			throw error;
		}
	}
}
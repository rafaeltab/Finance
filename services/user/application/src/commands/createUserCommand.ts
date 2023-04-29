// list a maximum of 30 asset groups

import { IUserFactory, userFactoryToken } from "@finance/svc-user-domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWorkToken } from "@finance/svc-user-infra-postgres";
import type { DateTime } from "luxon";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<{
	userIdentity: string;
}>;

export class CreateUserCommand extends ICommand<CreateUserCommand, ResponseType> {
    token = "CreateUserCommand";

    firstName!: string;

    lastName!: string;

    dateOfBirth!: DateTime;

    identity?: string;
}

@injectable()
export class CreateUserCommandHandler extends ICommandHandler<CreateUserCommand, ResponseType> {
    constructor(
		@inject(userFactoryToken) private userFactory: IUserFactory,
		@inject(unitOfWorkToken) private unitOfWork: IUnitOfWork
    ) {
        super();
    }

    async handle(command: CreateUserCommand): Promise<ResponseType> {
        try {
            await this.unitOfWork.start();

            const identity = command.identity ?? `user-${command.firstName}-${command.lastName}-${command.dateOfBirth.toFormat("yyyy-MM-dd")}`;

            const user = await this.userFactory.createUser(identity,
                command.firstName,
                command.lastName,
                command.dateOfBirth.toJSDate());

            await this.unitOfWork.commit();

            return {
                success: true,
                data: {
                    userIdentity: user.identity
                }
            }
        } catch (error) {
            await this.unitOfWork.rollback();
            throw error;
        }
    }
}
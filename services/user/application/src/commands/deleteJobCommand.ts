// list a maximum of 30 asset groups

import { IJobRepository, jobRepositoryToken } from "@finance/svc-user-domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWorkToken } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<undefined>;

export class DeleteJobCommand extends ICommand<DeleteJobCommand, ResponseType> {
	token = "DeleteJobCommand";

	jobIdentity!: string;
}

@injectable()
export class DeleteJobCommandHandler extends ICommandHandler<DeleteJobCommand, ResponseType> {
	constructor(
		@inject(jobRepositoryToken) private jobRepository: IJobRepository,
		@inject(unitOfWorkToken) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(command: DeleteJobCommand): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			await this.jobRepository.delete({
				identity: command.jobIdentity
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
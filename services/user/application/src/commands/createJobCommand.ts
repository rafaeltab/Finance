// list a maximum of 30 asset groups

import { IJobFactory, Job, jobFactory } from "@finance/svc-user-domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWork } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<Job>;

export class CreateJobCommand extends ICommand<CreateJobCommand, ResponseType> {
	token = "CreateJobCommand";
	userIdentity!: string;
	title!: string;
	monthlySalary!: number;
}

@injectable()
export class CreateJobCommandHandler extends ICommandHandler<CreateJobCommand, ResponseType> {
	constructor(
		@inject(jobFactory) private jobFactory: IJobFactory,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(command: CreateJobCommand): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const job = await this.jobFactory.addJobToUser({
				identity: command.userIdentity,
			}, command.title, command.monthlySalary);

			await this.unitOfWork.commit();

			return {
				success: true,
				data: job
			}
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
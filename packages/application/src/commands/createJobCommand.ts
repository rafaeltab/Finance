// list a maximum of 30 asset groups

import { IJobFactory, Job, jobFactory } from "@finance/domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/libs-types";
import { IUnitOfWork, unitOfWork } from "@finance/postgres";
import { inject, injectable } from "tsyringe";

type ResponseType = ICommandResult<Job>;

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
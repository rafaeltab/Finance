// list a maximum of 30 asset groups

import { IJobRepository, Job, PaginatedBase, jobRepository } from "@finance/svc-user-domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/lib-mediator";
import { unitOfWork, type IUnitOfWork } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = IQueryResult<PaginatedBase<Job>>

export class JobViewQuery extends IQuery<JobViewQuery, ResponseType> {
	token = "JobViewQuery";

	userIdentity!: string;

	limit = 30;

	offset = 0;
}

@injectable()
export class JobViewQueryHandler extends IQueryHandler<JobViewQuery, ResponseType> {
	/**
	 *
	 */
	constructor(
		@inject(jobRepository) private jobRepository: IJobRepository,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();

	}

	async handle(query: JobViewQuery): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const jobs = await this.jobRepository.getAllJobsForUser({
				identity: query.userIdentity,
			}, query.limit, query.offset);

			await this.unitOfWork.commit();

			return {
				success: true,
				data: {
					page: {
						count: jobs.page.count,
						offset: jobs.page.offset,
						total: jobs.page.total,
					},
					data: jobs.data
				}
			}
		} catch (e: unknown) {
			await this.unitOfWork.rollback();
			throw e;
		}
	}
}
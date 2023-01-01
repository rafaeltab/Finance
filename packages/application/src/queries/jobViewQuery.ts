// list a maximum of 30 asset groups

import { IJobRepository, Job, PaginatedBase, jobRepository } from "@finance/domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/libs-types";
import { inject, injectable } from "tsyringe";

type ResponseType = IQueryResult<PaginatedBase<Job>>

export class JobViewQuery extends IQuery<JobViewQuery, ResponseType> {
	token = "JobViewQuery";
	userIdentity!: string;

	limit: number = 30;
	offset: number = 0;
}

@injectable()
export class JobViewQueryHandler extends IQueryHandler<JobViewQuery, ResponseType> {
	/**
	 *
	 */
	constructor(@inject(jobRepository) private jobRepository: IJobRepository) {
		super();

	}

	async handle(query: JobViewQuery): Promise<ResponseType> {
		const jobs = await this.jobRepository.getAllJobsForUser({
			identity: query.userIdentity,
		}, query.limit, query.offset);

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
	}
}
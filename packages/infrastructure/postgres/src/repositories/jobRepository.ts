import { unitOfWork, UnitOfWork } from "../unitOfWork/unitOfWork";
import { EntityKey, IJobRepository, PaginatedBase, Job } from "@finance/domain";
import { inject, injectable } from "tsyringe";

@injectable()
export class JobRepository implements IJobRepository {
	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }

	async getAllJobsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Job>> {
		const res = await this._unitOfWork.getQueryRunner().manager.findAndCount(Job, {
			where: {
				user: user
			},
			skip: offset,
			take: limit
		});

		return {
			page: {
				count: limit,
				offset: offset,
				total: res[1]
			},
			data: res[0]
		}
	}
	
	async get(id: EntityKey): Promise<Job> {
		const job =  await this._unitOfWork.getQueryRunner().manager.findOne(Job, {
			where: id
		});

		if (!job) {
			throw new Error("Job not found");
		}
		
		return job;
	}

	async delete(id: EntityKey): Promise<void> {
		await this._unitOfWork.getQueryRunner().manager.delete(Job, id);
	}
}
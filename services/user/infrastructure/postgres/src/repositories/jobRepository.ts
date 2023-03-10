import { EntityKey, getKey, IJobRepository, Job, PaginatedBase } from "@finance/svc-user-domain";
import { EntryNotFoundError } from "@finance/lib-errors";
import { inject, injectable } from "tsyringe";
import { unitOfWork, UnitOfWork } from "../unitOfWork/unitOfWork";

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
			throw new EntryNotFoundError(Job.name, getKey(id));
		}
		
		return job;
	}

	async delete(id: EntityKey): Promise<void> {
		const res = await this._unitOfWork.getQueryRunner().manager.delete(Job, id);
		if ((res.affected ?? 0) == 0) {
			throw new EntryNotFoundError(Job.name, getKey(id));
		}
	}
}
import { EntityKey, getKey, IJobRepository, Job, PaginatedBase } from "@finance/svc-user-domain";
import { EntryNotFoundError } from "@finance/lib-errors";
import { inject, injectable } from "tsyringe";
import { unitOfWorkToken, UnitOfWork } from "../unitOfWork/unitOfWork";

@injectable()
export class JobRepository implements IJobRepository {
    constructor(@inject(unitOfWorkToken) private unitOfWork: UnitOfWork) { }

    async getAllJobsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Job>> {
        const res = await this.unitOfWork.getQueryRunner().manager.findAndCount(Job, {
            where: {
                user
            },
            skip: offset,
            take: limit
        });

        return {
            page: {
                count: limit,
                offset,
                total: res[1]
            },
            data: res[0]
        }
    }
	
    async get(id: EntityKey): Promise<Job> {
        const job =  await this.unitOfWork.getQueryRunner().manager.findOne(Job, {
            where: id
        });

        if (!job) {
            throw new EntryNotFoundError(Job.name, getKey(id));
        }
		
        return job;
    }

    async delete(id: EntityKey): Promise<void> {
        const res = await this.unitOfWork.getQueryRunner().manager.delete(Job, id);
        if ((res.affected ?? 0)===0) {
            throw new EntryNotFoundError(Job.name, getKey(id));
        }
    }
}
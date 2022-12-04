import { InjectionToken } from "tsyringe";
import Job from "../aggregates/jobAggregrate";
import { EntityKey } from "../bases";
import { PaginatedBase } from "../bases/PaginatedBase";

export const jobRepository: InjectionToken = "IJobRepository";

export interface IJobRepository {
	getAllJobsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Job>>;

	get(id: EntityKey): Promise<Job>;

	delete(id: EntityKey): Promise<void>;
}
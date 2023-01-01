import type { InjectionToken } from "tsyringe";
import type Job from "../aggregates/jobAggregrate";
import type { EntityKey } from "../utils";
import type { PaginatedBase } from "../utils/PaginatedBase";

export const jobRepository: InjectionToken = "IJobRepository";

export interface IJobRepository {
	getAllJobsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Job>>;

	get(id: EntityKey): Promise<Job>;

	delete(id: EntityKey): Promise<void>;
}
import type { InjectionToken } from "tsyringe";
import type { Job } from "../aggregates/jobAggregrate";
import type { EntityKey } from "../utils";

export const jobFactory: InjectionToken = "IJobFactory";

export interface IJobFactory {
	addJobToUser(user: EntityKey, title: string, monthlySalary: number): Promise<Job>;
}
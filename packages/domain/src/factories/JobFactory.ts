import { InjectionToken } from "tsyringe";
import Job from "../aggregates/jobAggregrate";
import { EntityKey } from "../bases";

export const jobFactory: InjectionToken = "IJobFactory";

export interface IJobFactory {
	addJobToUser(user: EntityKey, title: string, monthlySalary: number): Promise<Job>;
}
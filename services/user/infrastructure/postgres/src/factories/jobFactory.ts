import { IJobFactory, EntityKey, Job, ActiveIncome, User, getKey } from "@finance/svc-user-domain";
import { inject, injectable } from "tsyringe";
import { DuplicateEntryError, EntryNotFoundError, UnexpectedError } from "@finance/lib-errors";
import { UnitOfWork, unitOfWorkToken } from "../unitOfWork/unitOfWork";

@injectable()
export class JobFactory implements IJobFactory {
	constructor(@inject(unitOfWorkToken) private unitOfWork: UnitOfWork) { }
	
	async addJobToUser(user: EntityKey, title: string, monthlySalary: number): Promise<Job> {
		const userEntity = await this.unitOfWork.getQueryRunner().manager.findOne(User, {
			where: user,
			relations: {
				jobs: true,
			}
		});

		if (!userEntity) {
			throw new EntryNotFoundError(User.name, getKey(user));
		}

		const identity = this.createIdentity(userEntity, title);

		const existingJob = await this.unitOfWork.getQueryRunner().manager.findOne(Job, {
			where: {
				identity
			}
		});

		if (existingJob != null) { 
			throw new DuplicateEntryError(Job.name, identity);
		}

		const activeIncome = new ActiveIncome({
			monthlySalary
		});

		const job = new Job({
			identity,
			title,
			activeIncome
		});

		if (userEntity.jobs === undefined) {
			throw new UnexpectedError(new Error("Jobs not loaded"));

		}

		userEntity.jobs.push(job);

		await this.unitOfWork.getQueryRunner().manager.save([job, userEntity]);

		return job;
	}

	private createIdentity(user: User, title: string): string {
		return `${user.identity}-job-${title.toLowerCase()}`;
	}
}
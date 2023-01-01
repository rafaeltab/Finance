import { IJobFactory, EntityKey, Job, ActiveIncome, User } from "@finance/domain";
import { inject, injectable } from "tsyringe";
import { UnitOfWork, unitOfWork } from "../unitOfWork/unitOfWork";

@injectable()
export class JobFactory implements IJobFactory {
	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }
	
	async addJobToUser(user: EntityKey, title: string, monthlySalary: number): Promise<Job> {
		const userEntity = await this._unitOfWork.getQueryRunner().manager.findOne(User, {
			where: user,
			relations: {
				jobs: true,
			}
		});

		if (!userEntity) {
			throw new Error("User not found");
		}

		const activeIncome = new ActiveIncome({
			monthlySalary: monthlySalary
		});

		const job = new Job({
			identity: this.createIdentity(userEntity, title),
			title: title,
			activeIncome: activeIncome
		});

		if (userEntity.jobs === undefined) {
			throw new Error("Jobs not loaded");
		}

		userEntity.jobs.push(job);

		await this._unitOfWork.getQueryRunner().manager.save([job, userEntity]);

		return job;
	}

	private createIdentity(user: User, title: string): string {
		return `${user.identity}-job-${title.toLowerCase()}`;
	}
}
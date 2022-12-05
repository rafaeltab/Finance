import { IJobFactory, EntityKey, Job, ActiveIncome, User } from "@finance/domain";
import { inject } from "tsyringe";
import { UnitOfWork, unitOfWork } from "../unitOfWork/unitOfWork";

export class JobFactory implements IJobFactory {
	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }
	async addJobToUser(user: EntityKey, identity: string, title: string, monthlySalary: number): Promise<Job> {
		const activeIncome = new ActiveIncome({
			monthlySalary: monthlySalary
		});

		const job = new Job({
			identity: identity,
			title: title,
			activeIncome: activeIncome
		});

		const userEntity = await this._unitOfWork.getQueryRunner().manager.findOne(User, {
			where: user,
			relations: {
				jobs: true,
			}
		});

		userEntity.jobs.push(job);

		await this._unitOfWork.getQueryRunner().manager.save([job, userEntity]);

		return job;
	}
}
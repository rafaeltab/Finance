import { User, IUserFactory } from "@finance/domain";
import { inject } from "tsyringe";
import { UnitOfWork, unitOfWork } from "../unitOfWork/unitOfWork";

export class UserFactory implements IUserFactory {
	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }

	async createUser(identity: string, firstName: string, lastName: string, age: number): Promise<User> {
		const user = this._unitOfWork.getQueryRunner().manager.create(User, {
			identity: identity,
			firstName: firstName,
			lastName: lastName,
			age: age
		})

		const saveRes = await this._unitOfWork.getQueryRunner().manager.save(user);

		return saveRes;
	}	
}
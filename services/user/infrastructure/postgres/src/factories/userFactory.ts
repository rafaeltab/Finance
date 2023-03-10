import { User, IUserFactory } from "@finance/svc-user-domain";
import { inject, injectable } from "tsyringe";
import { UnitOfWork, unitOfWork } from "../unitOfWork/unitOfWork";
import { DuplicateEntryError } from "@finance/lib-errors";

@injectable()
export class UserFactory implements IUserFactory {
	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }

	async createUser(identity: string, firstName: string, lastName: string, dateOfBirth: Date): Promise<User> {
		const existingUser = await this._unitOfWork.getQueryRunner().manager.findOne(User,
			{
				where: {
					identity
				}
			});

		if (existingUser != null) {
			throw new DuplicateEntryError(User.name, identity);	
		}
		
		const user = this._unitOfWork.getQueryRunner().manager.create(User, {
			identity: identity,
			firstName: firstName,
			lastName: lastName,
			dateOfBirth: dateOfBirth
		})

		const saveRes = await this._unitOfWork.getQueryRunner().manager.save(user);

		return saveRes;
	}
}
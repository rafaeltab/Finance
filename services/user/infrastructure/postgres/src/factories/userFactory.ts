import { User, IUserFactory } from "@finance/svc-user-domain";
import { inject, injectable } from "tsyringe";
import { DuplicateEntryError } from "@finance/lib-errors";
import { UnitOfWork, unitOfWorkToken } from "../unitOfWork/unitOfWork";

@injectable()
export class UserFactory implements IUserFactory {
	constructor(@inject(unitOfWorkToken) private unitOfWork: UnitOfWork) { }

	async createUser(identity: string, firstName: string, lastName: string, dateOfBirth: Date): Promise<User> {
		const existingUser = await this.unitOfWork.getQueryRunner().manager.findOne(User,
			{
				where: {
					identity
				}
			});

		if (existingUser != null) {
			throw new DuplicateEntryError(User.name, identity);	
		}
		
		const user = this.unitOfWork.getQueryRunner().manager.create(User, {
			identity,
			firstName,
			lastName,
			dateOfBirth
		})

		const saveRes = await this.unitOfWork.getQueryRunner().manager.save(user);

		return saveRes;
	}
}
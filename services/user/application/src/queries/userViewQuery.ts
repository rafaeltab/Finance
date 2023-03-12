// list a maximum of 30 asset groups

import { IUserRepository, User, userRepository } from "@finance/svc-user-domain";
import { assertContains, WithRequiredProperty } from "@finance/lib-test";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWork } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";



const fields = ["assetGroups", "bankAccounts", "jobs", "dateOfBirth", "firstName", "lastName"] as const;
export type ResponseType = IQueryResult<WithRequiredProperty<User, (typeof fields)[number]>>

export class UserViewQuery extends IQuery<UserViewQuery, ResponseType> {
	token = "UserViewQuery";
	userIdentity!: string;
}

@injectable()
export class UserViewQueryHandler extends IQueryHandler<UserViewQuery, ResponseType> {
	constructor(
		@inject(userRepository) private userRepository: IUserRepository,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(query: UserViewQuery): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const user = await this.userRepository.get({
				identity: query.userIdentity
			}, ["assetGroups", "bankAccounts", "jobs", "dateOfBirth", "firstName", "lastName"])

			assertContains(user, fields);

			await this.unitOfWork.commit();

			return {
				success: true,
				data: user
			}
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
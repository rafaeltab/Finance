import { UserListQuery, UserViewQuery } from "@finance/application";
import { Mediator } from "@finance/libs-types";
import { Controller, Get, HttpException, Inject, Param } from "@nestjs/common";

@Controller("/api/v1/user")
export class UserController {
	constructor(@Inject(Mediator) private mediator: Mediator) { }

	@Get()
	async get() {
		const queryResult = await this.mediator.query(new UserListQuery({
			limit: 30,
			offset: 0
		}));

		if (queryResult.success) {
			return queryResult;
		}

		throw new HttpException(queryResult.message, queryResult.httpCode ?? 500);
	}

	@Get(":identity")
	async getByIdentity(
		@Param("identity") identity: string
	) {
		const queryResult = await this.mediator.query(new UserViewQuery({
			userIdentity: identity,
		}))

		if (queryResult.success) {
			return queryResult;
		}

		throw new HttpException(queryResult.message, queryResult.httpCode ?? 500);
	}
}

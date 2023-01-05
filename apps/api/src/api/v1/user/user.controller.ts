import { UserListQuery, UserViewQuery, CreateUserCommand, DeleteUserCommand } from "@finance/application";
import { Mediator } from "@finance/libs-types";
import { Body, Controller, Get, HttpException, Inject, Param, Put } from "@nestjs/common";
import { Delete } from "@nestjs/common/decorators";
import { DateTime } from "luxon";

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

	@Put()
	async insert(
		@Body("firstName") firstName: string,
		@Body("lastName") lastName: string,
		@Body("dateOfBirth") dateOfBirthString: string,
	) {
		let dateOfBirth = DateTime.fromISO(dateOfBirthString, {
			zone: "utc"
		})
		const commandResult = await this.mediator.command(new CreateUserCommand({
			firstName,
			lastName,
			dateOfBirth,
		}));

		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}

	@Delete("/:identity")
	async delete(@Param("identity") identity: string){
		const commandResult = await this.mediator.command(new DeleteUserCommand({
			userIdentity: identity
		}));

		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}
}

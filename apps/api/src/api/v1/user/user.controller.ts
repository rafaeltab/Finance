import { UserListQuery, UserViewQuery, CreateUserCommand, DeleteUserCommand } from "@finance/application";
import { Mediator } from "@finance/libs-types";
import { Body, Controller, Get, HttpException, Inject, Param, Put } from "@nestjs/common";
import { Delete } from "@nestjs/common/decorators";
import { DateTime } from "luxon";
import { CreateUserBody } from "./createUser.body";
import { IdentityParams } from "../identity.params";

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
		@Param() param: IdentityParams
	) {
		const queryResult = await this.mediator.query(new UserViewQuery({
			userIdentity: param.identity,
		}))

		if (queryResult.success) {
			return queryResult;
		}

		throw new HttpException(queryResult.message, queryResult.httpCode ?? 500);
	}

	@Put()
	async insert(
		@Body() body: CreateUserBody
	) {
		let dateOfBirth = DateTime.fromISO(body.dateOfBirth, {
			zone: "utc"
		})
		const commandResult = await this.mediator.command(new CreateUserCommand({
			firstName: body.firstName,
			lastName: body.lastName,
			dateOfBirth,
		}));

		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}

	@Delete("/:identity")
	async delete(
		@Param() param: IdentityParams
	){
		const commandResult = await this.mediator.command(new DeleteUserCommand({
			userIdentity: param.identity
		}));

		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}
}

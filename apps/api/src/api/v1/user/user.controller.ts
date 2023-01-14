import { CreateUserCommand, DeleteUserCommand, UserListQuery, UserViewQuery } from "@finance/application";
import { DuplicateEntryError, EntryNotFoundError } from "@finance/errors";
import { FinanceErrors } from "@finance/errors-nest";
import { Mediator } from "@finance/libs-types";
import { Body, Controller, Get, Inject, Param, Put } from "@nestjs/common";
import { Delete } from "@nestjs/common/decorators";
import { DateTime } from "luxon";
import { IdentityParam, IdentityParams } from "../identity.params";
import { CreateUserBody } from "./createUser.body";

@Controller("/api/v1/user")
export class UserController {
	constructor(@Inject(Mediator) private mediator: Mediator) { }

	@Get()
	@FinanceErrors([])
	async get() {
		return await this.mediator.query(new UserListQuery({
			limit: 30,
			offset: 0
		}));
	}

	@Get(":identity")
	@FinanceErrors([EntryNotFoundError])
	@IdentityParam()
	async getByIdentity(
		@Param() param: IdentityParams
	) {
		return await this.mediator.query(new UserViewQuery({
			userIdentity: param.identity,
		}))
	}

	@Put()
	@FinanceErrors([DuplicateEntryError])
	async insert(
		@Body() body: CreateUserBody
	) {
		let dateOfBirth = DateTime.fromISO(body.dateOfBirth, {
			zone: "utc"
		})
		return await this.mediator.command(new CreateUserCommand({
			firstName: body.firstName,
			lastName: body.lastName,
			dateOfBirth,
		}));
	}

	@Delete("/:identity")
	@FinanceErrors([EntryNotFoundError])
	@IdentityParam()
	async delete(
		@Param() param: IdentityParams
	){
		return await this.mediator.command(new DeleteUserCommand({
			userIdentity: param.identity
		}));
	}
}

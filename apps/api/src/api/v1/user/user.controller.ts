import { CreateUserCommand, DeleteUserCommand, UserListQuery, UserViewQuery } from "@finance/application";
import { DuplicateEntryError, EntryNotFoundError } from "@finance/errors";
import { FinanceErrors } from "@finance/errors-nest";
import { Mediator } from "@finance/libs-types";
import { Body, Controller, Get, Inject, Param, Put } from "@nestjs/common";
import { Delete } from "@nestjs/common/decorators";
import { DateTime } from "luxon";
import { IdentityParam, IdentityParams } from "../identity.params";
import { CreateUserBody } from "./createUser.body";
import { ApiOkResponse } from "@nestjs/swagger";
import { GetUsersResponse, InsertUserResponse, UserViewResponse } from "./user.responses";
import { SuccessResponse } from "../responses/success.response";

@Controller("/api/v1/user")
export class UserController {
	constructor(@Inject(Mediator) private mediator: Mediator) { }

	@Get()
	@FinanceErrors([])
	@ApiOkResponse({
		type: GetUsersResponse
	})
	async get() {
		return GetUsersResponse.map(await this.mediator.query(new UserListQuery({
			limit: 30,
			offset: 0
		})));
	}

	@Get(":identity")
	@FinanceErrors([EntryNotFoundError])
	@IdentityParam()
	@ApiOkResponse({
		type: UserViewResponse
	})
	async getByIdentity(
		@Param() param: IdentityParams
	): Promise<UserViewResponse> {
		return UserViewResponse.map(await this.mediator.query(new UserViewQuery({
			userIdentity: param.identity,
		})));
	}

	@Put()
	@FinanceErrors([DuplicateEntryError])
	@ApiOkResponse({
		type: InsertUserResponse
	})
	async insert(
		@Body() body: CreateUserBody
	): Promise<InsertUserResponse> {
		let dateOfBirth = DateTime.fromISO(body.dateOfBirth, {
			zone: "utc"
		})
		return InsertUserResponse.map(await this.mediator.command(new CreateUserCommand({
			firstName: body.firstName,
			lastName: body.lastName,
			dateOfBirth,
		})));
	}

	@Delete("/:identity")
	@FinanceErrors([EntryNotFoundError])
	@IdentityParam()
	@ApiOkResponse({
		type: SuccessResponse
	})
	async delete(
		@Param() param: IdentityParams
	): Promise<SuccessResponse> {
		await this.mediator.command(new DeleteUserCommand({
			userIdentity: param.identity
		}));

		return {
			success: true
		}
	}
}

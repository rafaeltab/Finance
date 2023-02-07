import { CreateUserCommand, DeleteUserCommand, UserListQuery, UserViewQuery } from "@finance/application";
import { DuplicateEntryError, EntryNotFoundError } from "@finance/errors";
import { FinanceErrors } from "@finance/errors-nest";
import { Mediator } from "@finance/libs-types";
import { Body, Controller, Get, Inject, Param, Put } from "@nestjs/common";
import { Delete, UseGuards } from "@nestjs/common/decorators";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { DateTime } from "luxon";
import { ScopeGuard } from "../../../authz/scope.guard";
import { Subject } from "../../../authz/subject.param";
import { IdentityParam, IdentityParams } from "../identity.params";
import { SuccessResponse } from "../responses/success.response";
import { CreateUserBody } from "./createUser.body";
import { GetUsersResponse, InsertUserResponse, UserViewResponse } from "./user.responses";

@Controller("/api/v1/user")
export class UserController {
	constructor(@Inject(Mediator) private mediator: Mediator) { }

	@Get()
	@FinanceErrors([])
	@ApiBearerAuth("oauth2")
	@UseGuards(new ScopeGuard(["admin"]))
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
	@ApiBearerAuth("oauth2")
	@UseGuards(new ScopeGuard(["admin"], "identity"))
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
	@ApiBearerAuth("oauth2")
	@ApiOkResponse({
		type: InsertUserResponse
	})
	async insert( 
		@Body() body: CreateUserBody,
		@Subject() subject: String
	): Promise<InsertUserResponse> {
		let identity = subject;

		if (typeof identity !== "string") throw new Error("Invalid identity type");

		let dateOfBirth = DateTime.fromISO(body.dateOfBirth, {
			zone: "utc"
		})
		return InsertUserResponse.map(await this.mediator.command(new CreateUserCommand({
			identity,
			firstName: body.firstName,
			lastName: body.lastName,
			dateOfBirth,
		})));
	}

	@Delete("/:identity")
	@FinanceErrors([EntryNotFoundError])
	@ApiBearerAuth("oauth2")
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

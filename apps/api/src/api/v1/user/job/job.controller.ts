import { CreateJobCommand, DeleteJobCommand, JobViewQuery } from "@finance/application";
import { Mediator } from "@finance/libs-types";
import { Body, Controller, Get, HttpException, Inject, Param, Put } from "@nestjs/common";
import { Delete } from "@nestjs/common/decorators";
import type { CreateJobBody } from "./createJob.body";
import type { UserIdentityParams } from "../userIdentity.params";

@Controller("/api/v1/user/:userIdentity/job")
export class JobController {
	constructor(@Inject(Mediator) private mediator: Mediator) { }

	@Get()
	async get(
		@Param() param: UserIdentityParams,

	) {
		const queryResult = await this.mediator.query(new JobViewQuery({
			userIdentity: param.userIdentity,
			limit: 30,
			offset: 0,
		}));

		if (queryResult.success) {
			return queryResult;
		}

		throw new HttpException(queryResult.message, queryResult.httpCode ?? 500);
	}

	@Put()
	async insert(
		@Param() param: UserIdentityParams,
		@Body() body: CreateJobBody,
	) {
		const commandResult = await this.mediator.command(new CreateJobCommand({
			userIdentity: param.userIdentity,
			title: body.title,
			monthlySalary: body.monthlySalary,
		}));

		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}

	@Delete("/:identity")
	async delete(@Param("identity") identity: string) {
		const commandResult = await this.mediator.command(new DeleteJobCommand({
			jobIdentity: identity
		}));

		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}
}

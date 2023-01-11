import { CreateJobCommand, DeleteJobCommand, JobViewQuery } from "@finance/application";
import { DuplicateEntryError, EntryNotFoundError } from "@finance/errors";
import { FinanceErrors } from "@finance/errors-nest";
import { Mediator } from "@finance/libs-types";
import { Body, Controller, Get, Inject, Param, Put } from "@nestjs/common";
import { Delete } from "@nestjs/common/decorators";
import { IdentityParams } from "../../identity.params";
import { UserIdentityParams } from "../userIdentity.params";
import { CreateJobBody } from "./createJob.body";

@Controller("/api/v1/user/:userIdentity/job")
export class JobController {
	constructor(@Inject(Mediator) private mediator: Mediator) { }

	@Get()
	@FinanceErrors([EntryNotFoundError])
	async get(
		@Param() param: UserIdentityParams,

	) {
		return await this.mediator.query(new JobViewQuery({
			userIdentity: param.userIdentity,
			limit: 30,
			offset: 0,
		}));
	}

	@Put()
	@FinanceErrors([DuplicateEntryError])
	async insert(
		@Param() param: UserIdentityParams,
		@Body() body: CreateJobBody,
	) {
		return await this.mediator.command(new CreateJobCommand({
			userIdentity: param.userIdentity,
			title: body.title,
			monthlySalary: body.monthlySalary,
		}));
	}

	@Delete("/:identity")
	@FinanceErrors([EntryNotFoundError])
	async delete(
		@Param() param: IdentityParams
	) {
		return await this.mediator.command(new DeleteJobCommand({
			jobIdentity: param.identity
		}));
	}
}

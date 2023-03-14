import { CreateJobCommand, DeleteJobCommand, JobViewQuery } from "@finance/svc-user-application";
import { DuplicateEntryError, EntryNotFoundError } from "@finance/lib-errors";
import { FinanceErrors } from "@finance/lib-errors-nest";
import { Mediator } from "@finance/lib-mediator";
import { Body, Controller, Get, Inject, Param, Put } from "@nestjs/common";
import { Delete } from "@nestjs/common/decorators";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { IdentityParam, IdentityParams } from "../../identity.params";
import { SuccessResponse } from "../../responses/success.response";
import { UserIdentityParam, UserIdentityParams } from "../userIdentity.params";
import { CreateJobBody } from "./createJob.body";
import { CreateJobResponse, JobsViewResponse } from "./job.responses";

@Controller("/api/v1/user/:userIdentity/job")
export class JobController {
	constructor(@Inject(Mediator) private mediator: Mediator) { }

	@Get()
	@FinanceErrors([EntryNotFoundError])
	@ApiBearerAuth("oauth2")
	@UserIdentityParam()
	@ApiOkResponse({
		type: JobsViewResponse
	})
	async get(
		@Param() param: UserIdentityParams,
	): Promise<JobsViewResponse> {
		return JobsViewResponse.map(await this.mediator.query(new JobViewQuery({
			userIdentity: param.userIdentity,
			limit: 30,
			offset: 0,
		})));
	}

	@Put()
	@FinanceErrors([DuplicateEntryError])
	@ApiBearerAuth("oauth2")
	@UserIdentityParam()
	@ApiOkResponse({
		type: CreateJobResponse
	})
	async insert(
		@Param() param: UserIdentityParams,
		@Body() body: CreateJobBody,
	): Promise<CreateJobResponse> {
		return CreateJobResponse.map(await this.mediator.command(new CreateJobCommand({
			userIdentity: param.userIdentity,
			title: body.title,
			monthlySalary: body.monthlySalary,
		})));
	}

	@Delete("/:identity")
	@FinanceErrors([EntryNotFoundError])
	@ApiBearerAuth("oauth2")
	@IdentityParam()
	@UserIdentityParam()
	@ApiOkResponse({
		type: SuccessResponse
	})
	async delete(
		@Param() param: IdentityParams
	): Promise<SuccessResponse> {
		return this.mediator.command(new DeleteJobCommand({
			jobIdentity: param.identity
		}));
	}
}

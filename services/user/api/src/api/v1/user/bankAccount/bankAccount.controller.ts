import { BankAccountViewQuery, CreateBankAccountCommand, DeleteBankAccountCommand } from "@finance/svc-user-application";
import { DuplicateEntryError, EntryNotFoundError } from "@finance/lib-errors";
import { FinanceErrors } from "@finance/lib-errors-nest";
import { Mediator } from "@finance/lib-mediator";
import { Body, Controller, Get, Inject, Param, Put, ValidationPipe } from "@nestjs/common";
import { Delete } from "@nestjs/common/decorators";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { IdentityParam, IdentityParams } from "../../identity.params";
import { SuccessResponse } from "../../responses/success.response";
import { UserIdentityParam, UserIdentityParams } from "../userIdentity.params";
import { BankAccountsViewResponse, CreateBankAccountResponse } from "./bankAccount.responses";
import { CreateBankAccountBody } from "./createBankAccount.body";

@Controller("/api/v1/user/:userIdentity/bankAccount")
export class BankAccountController {
	constructor(@Inject(Mediator) private mediator: Mediator) { }

	@Get()
	@FinanceErrors([EntryNotFoundError])
	@ApiBearerAuth("oauth2")
	@UserIdentityParam()
	@ApiOkResponse({
		type: BankAccountsViewResponse
	})
	async get(
		@Param() param: UserIdentityParams,
	): Promise<BankAccountsViewResponse> {
		return BankAccountsViewResponse.map(await this.mediator.query(new BankAccountViewQuery({
			userIdentity: param.userIdentity,
			limit: 30,
			offset: 0,
		})));
	}

	@Put()
	@FinanceErrors([DuplicateEntryError, EntryNotFoundError])
	@ApiBearerAuth("oauth2")
	@UserIdentityParam()
	@ApiOkResponse({
		type: CreateBankAccountResponse
	})
	async insert(
		@Param() param: UserIdentityParams,
		@Body(new ValidationPipe()) body: CreateBankAccountBody
	): Promise<CreateBankAccountResponse> {
		return CreateBankAccountResponse.map(await this.mediator.command(new CreateBankAccountCommand({
			userIdentity: param.userIdentity,
			balance: body.balance,
			bank: body.bank,
			currrency: body.currency,
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
		return await this.mediator.command(new DeleteBankAccountCommand({
			bankAccountIdentity: param.identity
		}));
	}
}

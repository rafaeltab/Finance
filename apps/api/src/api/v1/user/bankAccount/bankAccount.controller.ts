import { BankAccountViewQuery, CreateBankAccountCommand, DeleteBankAccountCommand } from "@finance/application";
import { DuplicateEntryError, EntryNotFoundError } from "@finance/errors";
import { FinanceErrors } from "@finance/errors-nest";
import { Mediator } from "@finance/libs-types";
import { Body, Controller, Get, Inject, Param, Put, ValidationPipe } from "@nestjs/common";
import { Delete } from "@nestjs/common/decorators";
import { IdentityParam, IdentityParams } from "../../identity.params";
import { UserIdentityParam, UserIdentityParams } from "../userIdentity.params";
import { CreateBankAccountBody } from "./createBankAccount.body";

@Controller("/api/v1/user/:userIdentity/bankAccount")
export class BankAccountController {
	constructor(@Inject(Mediator) private mediator: Mediator) { }

	@Get()
	@FinanceErrors([EntryNotFoundError])
	@UserIdentityParam()
	async get(
		@Param() param: UserIdentityParams,
	) {
		return await this.mediator.query(new BankAccountViewQuery({
			userIdentity: param.userIdentity,
			limit: 30,
			offset: 0,
		}));
	}

	@Put()
	@FinanceErrors([DuplicateEntryError, EntryNotFoundError])
	@UserIdentityParam()
	async insert(
		@Param() param: UserIdentityParams,
		@Body(new ValidationPipe()) body: CreateBankAccountBody
	) {
		return await this.mediator.command(new CreateBankAccountCommand({
			userIdentity: param.userIdentity,
			balance: body.balance,
			bank: body.bank,
			currrency: body.currency,
		}));
	}

	@Delete("/:identity")
	@FinanceErrors([EntryNotFoundError])
	@IdentityParam()
	@UserIdentityParam()
	async delete(
		@Param() param: IdentityParams
	) {
		return await this.mediator.command(new DeleteBankAccountCommand({
			bankAccountIdentity: param.identity
		}));
	}
}

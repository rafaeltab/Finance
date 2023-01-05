import { CreateBankAccountCommand, DeleteBankAccountCommand, BankAccountViewQuery } from "@finance/application";
import { Mediator } from "@finance/libs-types";
import { Body, Controller, Get, HttpException, Inject, Param, Put, ValidationPipe } from "@nestjs/common";
import { Delete } from "@nestjs/common/decorators";
import { CreateBankAccountBody } from "./createBankAccount.body";
import { UserIdentityParams } from "../userIdentity.params";
import { IdentityParams } from "../../identity.params";

@Controller("/api/v1/user/:userIdentity/bankAccount")
export class BankAccountController {
	constructor(@Inject(Mediator) private mediator: Mediator) { }

	@Get()
	async get(
		@Param() param: UserIdentityParams,
	) {
		const queryResult = await this.mediator.query(new BankAccountViewQuery({
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
		@Body(new ValidationPipe()) body: CreateBankAccountBody
	) {
		const commandResult = await this.mediator.command(new CreateBankAccountCommand({
			userIdentity: param.userIdentity,
			balance: body.balance,
			bank: body.bank,
			currrency: body.currency,
		}));
		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}

	@Delete("/:identity")
	async delete(
		@Param() param: IdentityParams
	) {
		const commandResult = await this.mediator.command(new DeleteBankAccountCommand({
			bankAccountIdentity: param.identity
		}));

		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}
}

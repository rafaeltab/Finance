import { ProgrammerError, UserError } from "@finance/lib-errors";
import { ArgumentsHost, Catch, ExceptionFilter, HttpServer, Logger } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { handleError } from "./handleError";

@Catch(UserError)
export class FinanceUserErrorExceptionFilter implements ExceptionFilter<UserError> {
	private _baseFilter: BaseExceptionFilter;

	constructor(applicationRef?: HttpServer) {
		this._baseFilter = new BaseExceptionFilter(applicationRef);
	}

	catch(exception: UserError, host: ArgumentsHost) {
		const error = handleError(exception);
		this._baseFilter.catch(error, host);
	}
}

@Catch(ProgrammerError)
export class FinanceProgrammerErrorExceptionFilter implements ExceptionFilter<ProgrammerError> {
	private _baseFilter: BaseExceptionFilter;

	constructor(applicationRef?: HttpServer) {
		this._baseFilter = new BaseExceptionFilter(applicationRef);
	}

	catch(exception: ProgrammerError, host: ArgumentsHost) {
		Logger.error(exception);

		const error = handleError(exception);
		this._baseFilter.catch(error, host);
	}
}
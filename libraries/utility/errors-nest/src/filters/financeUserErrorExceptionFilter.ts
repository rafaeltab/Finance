import { UserError } from "@finance/lib-errors";
import { Catch, type ExceptionFilter, type HttpServer, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { handleError } from "../handleError";

@Catch(UserError)
export class FinanceUserErrorExceptionFilter implements ExceptionFilter<UserError> {
    private baseFilter: BaseExceptionFilter;

    constructor(applicationRef?: HttpServer) {
        this.baseFilter = new BaseExceptionFilter(applicationRef);
    }

    catch(exception: UserError, host: ArgumentsHost) {
        const error = handleError(exception);
        this.baseFilter.catch(error, host);
    }
}
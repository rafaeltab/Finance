import { ProgrammerError } from "@finance/lib-errors";
import { Catch, Logger, type ArgumentsHost, type ExceptionFilter, type HttpServer } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { handleError } from "../handleError";

@Catch(ProgrammerError)
export class FinanceProgrammerErrorExceptionFilter implements ExceptionFilter<ProgrammerError> {
    private baseFilter: BaseExceptionFilter;

    constructor(applicationRef?: HttpServer) {
        this.baseFilter = new BaseExceptionFilter(applicationRef);
    }

    catch(exception: ProgrammerError, host: ArgumentsHost) {
        Logger.error(exception);

        const error = handleError(exception);
        this.baseFilter.catch(error, host);
    }
}
import { UnexpectedError, type IHttpCodeError } from "@finance/lib-errors";
import { HttpException } from "@nestjs/common";

function isHttpCodeError(err: Error): err is IHttpCodeError & Error {
    return "getHttpCode" in err && typeof err.getHttpCode === "function";
}

function hasErrorCause(err: Error): err is Error & {
	cause: Error
} {
    return "cause" in err && err.cause !== undefined && err.cause instanceof Error;
}

export function handleError(err: unknown): HttpException {
    if (err instanceof Error) {
        if (isHttpCodeError(err)) {
            if (hasErrorCause(err)) {
                return new HttpException(err.message, err.getHttpCode(), {
                    cause: err.cause
                });
            }
            return new HttpException(err.message, err.getHttpCode());

        }
        return handleError(new UnexpectedError(err));

    }
    return handleError(new UnexpectedError(err));

}

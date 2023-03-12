import { UnexpectedError, type IHttpCodeError } from "@finance/lib-errors";
import { HttpException } from "@nestjs/common";

export function handleError(err: unknown): HttpException {
	if (err instanceof Error) {
		if (isHttpCodeError(err)) {
			if (hasErrorCause(err)) {
				return new HttpException(err.message, err.httpCode(), {
					cause: err.cause
				});
			} else {
				return new HttpException(err.message, err.httpCode());
			}
		} else {
			return handleError(new UnexpectedError(err));
		}
	} else {
		return handleError(new UnexpectedError(err));
	}
}

function isHttpCodeError(err: Error): err is IHttpCodeError & Error {
	return "httpCode" in err && typeof err.httpCode === "function";
}

function hasErrorCause(err: Error): err is Error & {
	cause: Error
} {
	return "cause" in err && err.cause !== undefined && err.cause instanceof Error;
}
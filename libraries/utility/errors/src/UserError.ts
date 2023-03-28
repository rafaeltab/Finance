import type { IHttpCodeError } from "./IHttpCodeError";

export abstract class UserError extends Error implements IHttpCodeError {
	abstract httpCode: number;

	getHttpCode(): number {
		return this.httpCode;
	}
}
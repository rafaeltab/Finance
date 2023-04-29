import type { IHttpCodeError } from "./IHttpCodeError";

export abstract class ProgrammerError extends Error implements IHttpCodeError  {
	abstract httpCode: number;
	
	getHttpCode(): number {
	    return this.httpCode;
	}
}
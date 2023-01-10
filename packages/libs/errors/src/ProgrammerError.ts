import type { IHttpCodeError } from "./IHttpCodeError";

export abstract class ProgrammerError extends Error implements IHttpCodeError  {
	abstract _httpCode: number;
	
	httpCode(): number {
		return this._httpCode;
	}
}
import { ProgrammerError } from "../ProgrammerError";

export class UnexpectedError extends ProgrammerError {
	constructor(cause: unknown) {
		super();
		this.name = "UnexpectedError";
		this.message = `Unexpected error occurred`
		this.cause = cause;
	}

	override _httpCode: number = 500;
}

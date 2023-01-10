import type { IErrorParser } from "../IErrorParser";
import { UserError } from "../UserError";

export class DuplicateEntryError extends UserError { 
	constructor(entityName: string, key?: string) {
		super();
		this.name = "DuplicateEntryError";
		if (key !== undefined) {
			this.message = `Duplicate entry for ${entityName} with key ${key}. Entry already exists.`
		} else { 
			this.message = `Duplicate entry for ${entityName}. Entry already exists.`
		}
	}
	
	override _httpCode: number = 409;
}

export class DuplicateEntryParser implements IErrorParser<DuplicateEntryError> {
	isError(error: Error): error is DuplicateEntryError {
		const messageRegex = /duplicate\skey/;
		return error.message.match(messageRegex) != null;
	}
}
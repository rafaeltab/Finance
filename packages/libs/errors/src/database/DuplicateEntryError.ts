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

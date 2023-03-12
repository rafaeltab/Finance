import { UserError } from "../UserError";

export class EntryNotFoundError extends UserError {
	constructor(entityName: string, key?: string) {
		super();
		this.name = "EntryNotFoundError";
		if (key !== undefined) {
			this.message = `Entry for ${entityName} with key ${key} not found.`
		} else {
			this.message = `Entry for ${entityName} not found.`
		}
	}

	override _httpCode: number = 404;
}

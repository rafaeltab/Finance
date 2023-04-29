import type { ITokenable } from "./mediator";

export abstract class IEvent<TImplementation> implements ITokenable {
	/** This should be created by the query class, not the user */
	readonly abstract token: string;

	constructor(c: Omit<TImplementation, "token">) {
	    Object.assign(this, c);
	}
}

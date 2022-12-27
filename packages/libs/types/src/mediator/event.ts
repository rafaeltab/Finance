import { ITokenable } from "./mediator";

export abstract class IEvent<TImplementation> implements ITokenable {
	/** This should be created by the query class, not the user */
	readonly abstract token: string;

	constructor(c: Omit<TImplementation, "token">) {
		Object.assign(this, c);
	}
}

export abstract class IEventHandler<TEvent extends IEvent<TEvent>> {
	static createToken<TEvent extends IEvent<TEvent>>(event: new () => TEvent) {
		return `IEventHandler<${new event().token}>`
	}

	abstract handle(command: TEvent): Promise<void>
}
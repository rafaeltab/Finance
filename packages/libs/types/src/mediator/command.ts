import type { ITokenable } from "./mediator";

export type ISuccessCommandResult = {
	success: true;

	httpCode?: number;
}

export type IFailedCommandResult = {
	message: string;
	success: false;
	httpCode?: number;
}

export type ICommandResult = ISuccessCommandResult | IFailedCommandResult;

export abstract class ICommand<TImplementation> implements ITokenable {
	/** This should be created by the query class, not the user */
	readonly abstract token: string;

	constructor(c: Omit<TImplementation, "token">) {
	Object.assign(this, c);
}
}

export abstract class ICommandHandler<TCommand extends ICommand<TCommand>> {
	static createToken<TCommand extends ICommand<TCommand>>(command: new () => TCommand) {
		return `ICommandHandler<${new command().token}>`
	}

	abstract handle(command: TCommand): Promise<ICommandResult>
}
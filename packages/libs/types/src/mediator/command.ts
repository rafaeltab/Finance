import type { ITokenable } from "./mediator";

export type ISuccessCommandResult<TData> = {
	success: true;
	data: TData
}

export type ICommandResult<TData> = ISuccessCommandResult<TData>;

const responseSymbol = Symbol("response");

export abstract class ICommand<TImplementation, TResult extends ICommandResult<any>> implements ITokenable {
	/** This should be created by the query class, not the user */
	readonly abstract token: string;

	/** Just ignore this */
	[responseSymbol]?: TResult;

	constructor(c: Omit<TImplementation, "token" | typeof responseSymbol>) {
		Object.assign(this, c);
	}
}

export abstract class ICommandHandler<TCommand extends ICommand<TCommand, TResult>, TResult extends ICommandResult<any>> {
	static createToken<TCommand extends ICommand<TCommand, TResult>, TResult extends ICommandResult<any>>(command: new () => TCommand) {
		return `ICommandHandler<${new command().token}>`
	}

	abstract handle(command: TCommand): Promise<TResult>
}
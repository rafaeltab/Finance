import type { ITokenable } from "./mediator";

export type ISuccessCommandResult<TData> = {
	success: true;
	data: TData
}

export type ICommandResult<TData> = ISuccessCommandResult<TData>;

const responseSymbol = Symbol("response");

export abstract class ICommand<TImplementation, TResult extends ICommandResult<unknown>> implements ITokenable {
	/** This should be created by the query class, not the user */
	readonly abstract token: string;

	/** Just ignore this */
	[responseSymbol]?: TResult;

	constructor(c: Omit<TImplementation, "token" | typeof responseSymbol>) {
	    Object.assign(this, c);
	}
}
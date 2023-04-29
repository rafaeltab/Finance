import type { ITokenable } from "./mediator";

export interface ISuccessQueryResult<TData> {
	data: TData
	success: true;
}

export type IQueryResult<T> = ISuccessQueryResult<T>;

const responseSymbol = Symbol("response");

export abstract class IQuery<TImplementation, TResult extends IQueryResult<unknown>> implements ITokenable { 
	/** This should be created by the query class, not the user */
	readonly abstract token: string;

	/** Just ignore this */
	[responseSymbol]?: TResult;

	constructor(c: Omit<TImplementation, "token" | typeof responseSymbol>) { 
	    Object.assign(this, c);
	}
}

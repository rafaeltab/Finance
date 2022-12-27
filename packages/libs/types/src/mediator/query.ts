import { ITokenable } from "./mediator";

export interface ISuccessQueryResult<TData> {
	data: TData
	success: true;
}

export interface IFailedQueryResult {
	message: string;
	success: false;
}

export type IQueryResult<T> = ISuccessQueryResult<T> | IFailedQueryResult;

export abstract class IQuery<TImplementation, TResult extends IQueryResult<any>> implements ITokenable { 
	/** This should be created by the query class, not the user */
	readonly abstract token: string;

	constructor(c: Omit<TImplementation, "token">) { 
		Object.assign(this, c);
	}
}

export abstract class IQueryHandler<TQuery extends IQuery<TQuery, TResult>, TResult extends IQueryResult<any>> {
	static createToken<TQuery extends IQuery<TQuery, TResult>, TResult extends IQueryResult<any>>(query: new () => TQuery) {
		return `IQueryHandler<${new query().token}>`
	}

	abstract handle(query: TQuery): Promise<TResult>
}
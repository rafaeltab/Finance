import type { IQuery, IQueryResult } from "./query";

export abstract class IQueryHandler<TQuery extends IQuery<TQuery, TResult>, TResult extends IQueryResult<any>> {
	static createToken<TQuery extends IQuery<TQuery, TResult>, TResult extends IQueryResult<any>>(Query: new () => TQuery) {
		return `IQueryHandler<${new Query().token}>`
	}

	abstract handle(query: TQuery): Promise<TResult>
}
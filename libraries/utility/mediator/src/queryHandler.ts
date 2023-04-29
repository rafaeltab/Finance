import type { IQuery, IQueryResult } from "./query";

export abstract class IQueryHandler<TQuery extends IQuery<TQuery, TResult>, TResult extends IQueryResult<unknown>> {
    static createToken<TQuery extends IQuery<TQuery, TResult>, TResult extends IQueryResult<unknown>>(Query: new () => TQuery) {
        return `IQueryHandler<${new Query().token}>`
    }

	abstract handle(query: TQuery): Promise<TResult>
}
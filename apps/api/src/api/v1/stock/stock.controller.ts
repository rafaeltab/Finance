import { Controller, Get, Inject, Query, Param, HttpException } from '@nestjs/common';
import { Mediator } from '@finance/libs-types';
import { StocksDataListViewQuery, StockDataSearchQuery, StockDataViewQuery } from '@finance/application';

@Controller("/api/v1/stock")
export class StockController {
	constructor(@Inject(Mediator) private readonly mediator: Mediator) { }

	@Get("/search")
	async getSearch(
		@Query("exchange") exchange: string,
		@Query("symbol") symbol: string,
		@Query("type") type: string
	) {
		const queryResult = await this.mediator.query(new StockDataSearchQuery({
			exchange: exchange,
			symbol: symbol,
			type: type,
			limit: 30,
			offset: 0
		}));

		if (queryResult.success) {
			return queryResult;
		}

		throw new HttpException(queryResult.message, queryResult.httpCode ?? 500);
	}

	@Get("/:identity")
	async get(@Param("identity") identity: string) {
		const queryResult =  await this.mediator.query(new StockDataViewQuery({
			stockDataIdentity: identity,
			offset: 0,
			limit: 30
		}));

		if (queryResult.success) {
			return queryResult;
		}

		throw new HttpException(queryResult.message, queryResult.httpCode ?? 500);
	}

	@Get()
	async getStocks() {
		const queryResult = await this.mediator.query(new StocksDataListViewQuery({
			limit: 30,
			offset: 0
		}))

		if (queryResult.success) {
			return queryResult;
		}

		throw new HttpException(queryResult.message, queryResult.httpCode ?? 500);
	}
}

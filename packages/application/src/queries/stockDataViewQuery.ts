// list a maximum of 30 asset groups

import { IStockRepository, PaginatedBase, StockData, StockValue, TimeRange, stockRepository } from "@finance/domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/libs-types";
import { inject, injectable } from "tsyringe";

type ResponseType = IQueryResult<Response>

type Response = {
	stockData: StockData,
	yearlyValues: PaginatedBase<StockValue>,
	hasValues: boolean
}

export class StockDataViewQuery extends IQuery<StockDataViewQuery, ResponseType> {
	token = "stockDataViewQuery";
	stockDataIdentity!: string;

	limit: number = 30;
	offset: number = 0;
}

@injectable()
export class StockDataViewQueryHandler extends IQueryHandler<StockDataViewQuery, ResponseType> {
	/**
	 *
	 */
	constructor(@inject(stockRepository) private stockRepository: IStockRepository) {
		super();

	}

	async handle(query: StockDataViewQuery): Promise<ResponseType> {
		const start = new Date();
		start.setFullYear(start.getFullYear() - 100);

		const end = new Date();
		end.setDate(end.getDate() + 1);

		const identity = {
			identity: query.stockDataIdentity
		}

		try {
			const stockData = await this.stockRepository.getStockData(identity);
	
			const stocks = await this.stockRepository.getStockValues(identity, "year", new TimeRange(start, end), 1000, 0);
		
			return {
				success: true,
				data: {
					hasValues: stocks.page.total === 0,
					yearlyValues: {
						page: {
							count: stocks.page.count,
							offset: stocks.page.offset,
							total: stocks.page.total,
						},
						data: stocks.data
					},
					stockData: stockData
				}
			}
		} catch (e: unknown) {
			if (e instanceof Error) { 
				return {
					success: false,
					message: e.message,
					httpCode: e.message.includes("not found") ? 404 : 500
				}
			}
		}

		return {
			success: false,
			message: "Unknown error occured",
			httpCode: 500
		}
	}
}
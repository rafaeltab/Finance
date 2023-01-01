// list a maximum of 30 asset groups

import { IStockRepository, PaginatedBase, StockAssetKind, StockData, stockRepository } from "@finance/domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/libs-types";
import { inject, injectable } from "tsyringe";

type ResponseType = IQueryResult<Response>

type Response = {
	isEmpty: boolean
} & PaginatedBase<StockData>

export class StockDataSearchQuery extends IQuery<StockDataSearchQuery, ResponseType> {
	token = "StockDataSearchQuery";

	exchange: string = "";
	symbol: string = "";
	type: string = "";


	limit: number = 30;
	offset: number = 0;
}

@injectable()
export class StockDataSearchQueryHandler extends IQueryHandler<StockDataSearchQuery, ResponseType> {
	/**
	 *
	 */
	constructor(@inject(stockRepository) private stockRepository: IStockRepository) {
		super();
	}

	async handle(query: StockDataSearchQuery): Promise<ResponseType> {
		const start = new Date();
		start.setFullYear(start.getFullYear() - 100);

		const end = new Date();
		end.setDate(end.getDate() + 1);

		const kinds = Object.keys(StockAssetKind).map(x => x.toLowerCase());

		let kind: StockAssetKind | undefined = undefined;

		if (kinds.includes(query.type.toLowerCase())) {
			kind = StockAssetKind[Object.keys(StockAssetKind).find(x => x.toLowerCase() === query.type.toLowerCase()) as keyof typeof StockAssetKind];
		}

		const stocks = await this.stockRepository.searchStockData(
			query.symbol,
			query.exchange,
			kind,
			true,
			query.limit,
			query.offset);

		return {
			success: true,
			data: {
				isEmpty: stocks.page.total === 0,
				page: {
					count: stocks.page.count,
					offset: stocks.page.offset,
					total: stocks.page.total,
				},
				data: stocks.data
			}
		}
	}
}
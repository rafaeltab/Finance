// list a maximum of 30 asset groups

import { IStockRepository, PaginatedBase, StockData, stockRepository } from "@finance/domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/libs-types";
import { unitOfWork, type IUnitOfWork } from "@finance/postgres";
import { inject, injectable } from "tsyringe";

type ResponseType = IQueryResult<Response>

type Response = {
	isEmpty: boolean
} & PaginatedBase<StockData>

export class StocksDataListViewQuery extends IQuery<StocksDataListViewQuery, ResponseType> {
	token = "StocksDataListViewQuery";

	limit: number = 30;
	offset: number = 0;
}

@injectable()
export class StocksDataListViewQueryHandler extends IQueryHandler<StocksDataListViewQuery, ResponseType> {
	/**
	 *
	 */
	constructor(
		@inject(stockRepository) private stockRepository: IStockRepository,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();

	}

	async handle(query: StocksDataListViewQuery): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const stocks = await this.stockRepository.getAllStockData(true, query.limit, query.offset);

			await this.unitOfWork.commit();

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
		} catch (e: unknown) {
			await this.unitOfWork.rollback();
			throw e;
		}
	}
}
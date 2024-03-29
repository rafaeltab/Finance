// list a maximum of 30 asset groups

import { IStockRepository, PaginatedBase, StockData, StockValue, TimeRange, stockRepositoryToken } from "@finance/svc-user-domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/lib-mediator";
import { unitOfWorkToken, type IUnitOfWork } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = IQueryResult<Response>

type Response = {
	stockData: StockData,
	yearlyValues: PaginatedBase<StockValue>,
	hasValues: boolean
}

export class StockDataViewQuery extends IQuery<StockDataViewQuery, ResponseType> {
	token = "stockDataViewQuery";

	stockDataIdentity!: string;

	limit = 30;

	offset = 0;
}

@injectable()
export class StockDataViewQueryHandler extends IQueryHandler<StockDataViewQuery, ResponseType> {
	/**
	 *
	 */
	constructor(
		@inject(stockRepositoryToken) private stockRepository: IStockRepository,
		@inject(unitOfWorkToken) private unitOfWork: IUnitOfWork
	) {
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
			await this.unitOfWork.start();

			const stockData = await this.stockRepository.getStockData(identity);
	
			const stocks = await this.stockRepository.getStockValues(identity, "year", new TimeRange(start, end), 1000, 0);
		
			await this.unitOfWork.commit();

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
					stockData
				}
			}
		} catch (e: unknown) {
			await this.unitOfWork.rollback();
			throw e;
		}
	}
}
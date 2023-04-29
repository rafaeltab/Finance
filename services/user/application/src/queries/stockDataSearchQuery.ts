// list a maximum of 30 asset groups

import { IStockRepository, PaginatedBase, StockAssetKind, StockData, stockRepositoryToken } from "@finance/svc-user-domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/lib-mediator";
import { unitOfWorkToken, type IUnitOfWork } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = IQueryResult<Response>

type Response = {
	isEmpty: boolean
} & PaginatedBase<StockData>

export class StockDataSearchQuery extends IQuery<StockDataSearchQuery, ResponseType> {
    token = "StockDataSearchQuery";

    exchange?: string;

    symbol?: string;

    type?: string;


    limit = 30;

    offset = 0;
}

@injectable()
export class StockDataSearchQueryHandler extends IQueryHandler<StockDataSearchQuery, ResponseType> {
    /**
	 *
	 */
    constructor(
		@inject(stockRepositoryToken) private stockRepository: IStockRepository,
		@inject(unitOfWorkToken) private unitOfWork: IUnitOfWork
    ) {
        super();
    }

    async handle(query: StockDataSearchQuery): Promise<ResponseType> {
        try {
            const start = new Date();
            start.setFullYear(start.getFullYear() - 100);

            const end = new Date();
            end.setDate(end.getDate() + 1);

            const kinds = Object.keys(StockAssetKind).map(x => x.toLowerCase());

            let kind: StockAssetKind | undefined;

            const queryType = query.type

            if (queryType !== undefined) {
                if (kinds.includes(queryType.toLowerCase())) {
                    kind = StockAssetKind[Object.keys(StockAssetKind).find(x => x.toLowerCase() === queryType.toLowerCase()) as keyof typeof StockAssetKind];
                }
            }

            await this.unitOfWork.start();

            const stocks = await this.stockRepository.searchStockData(
                query.symbol,
                query.exchange,
                kind,
                true,
                query.limit,
                query.offset);

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
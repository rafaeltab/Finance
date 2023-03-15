// list a maximum of 30 asset groups

import { IStockFactory, StockAssetKind, stockFactoryToken } from "@finance/svc-user-domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWorkToken } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<{
	identities: string[]
}>;

export class CreateStockDatasCommand extends ICommand<CreateStockDatasCommand, ResponseType> {
	token = "CreateStockDatasCommand";

	stockDatas!: CreateStockData[];
}

type CreateStockData = {
	symbol: string;
	exchange: string;
	type: StockAssetKind;
}

@injectable()
export class CreateStockDatasCommandHandler extends ICommandHandler<CreateStockDatasCommand, ResponseType> {
	constructor(
		@inject(stockFactoryToken) private stockFactory: IStockFactory,
		@inject(unitOfWorkToken) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(command: CreateStockDatasCommand): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const results: string[] = [];

			for (const data of command.stockDatas) {
				// eslint-disable-next-line no-await-in-loop
				const stockData = await this.stockFactory.addStockData(
					data.symbol,
					data.exchange,
					data.type
				);

				results.push(stockData.identity);
			}

			await this.unitOfWork.commit();

			return {
				success: true,
				data: {
					identities: results
				}
			}
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
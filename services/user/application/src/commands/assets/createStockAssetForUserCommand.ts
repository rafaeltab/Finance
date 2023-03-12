// list a maximum of 30 asset groups

import { assetFactory, IAssetFactory, Asset } from "@finance/domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/libs-types";
import { IUnitOfWork, unitOfWork } from "@finance/postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<{
	asset: Asset,
	stockAsset: Asset
}>;

export class CreateStockAssetForUserCommand extends ICommand<CreateStockAssetForUserCommand, ResponseType> {
	token = "CreateStockAssetForUserCommand";
	userIdentity!: string;
	stockDataIdentity!: string;
	stockOrders!: {
		price: number;
		amount: number;
	}[];
}

@injectable()
export class CreateStockAssetForUserCommandHandler extends ICommandHandler<CreateStockAssetForUserCommand, ResponseType> {
	constructor(
		@inject(assetFactory) private assetFactory: IAssetFactory,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(command: CreateStockAssetForUserCommand): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const [stockAsset, asset] = await this.assetFactory.addStockToUser({
				identity: command.userIdentity,
			}, {
				identity: command.stockDataIdentity
			}, command.stockOrders)

			await this.unitOfWork.commit();

			return {
				success: true,
				data: {
					asset,
					stockAsset
				}
			}
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
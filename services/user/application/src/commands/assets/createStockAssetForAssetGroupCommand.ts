// list a maximum of 30 asset groups

import { assetFactory, IAssetFactory, Asset } from "@finance/svc-user-domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWork } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<{
	asset: Asset,
	stockAsset: Asset
}>;

export class CreateStockAssetForAssetGroupCommand extends ICommand<CreateStockAssetForAssetGroupCommand, ResponseType> {
	token = "CreateStockAssetForAssetGroupCommand";
	assetGroupIdentity!: string;
	stockDataIdentity!: string;
	stockOrders!: {
		price: number;
		amount: number;
	}[];
}

@injectable()
export class CreateStockAssetForAssetGroupCommandHandler extends ICommandHandler<CreateStockAssetForAssetGroupCommand, ResponseType> {
	constructor(
		@inject(assetFactory) private assetFactory: IAssetFactory,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(command: CreateStockAssetForAssetGroupCommand): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const [stockAsset, asset] = await this.assetFactory.addStockToAssetGroup({
				identity: command.assetGroupIdentity,
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
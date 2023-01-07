// list a maximum of 30 asset groups

import { assetFactory, IAssetFactory, Asset } from "@finance/domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/libs-types";
import { IUnitOfWork, unitOfWork } from "@finance/postgres";
import { inject, injectable } from "tsyringe";

type ResponseType = ICommandResult<{
	asset: Asset,
	realEstateAsset: Asset
}>;

export class CreateRealEstateAssetForAssetGroupCommand extends ICommand<CreateRealEstateAssetForAssetGroupCommand, ResponseType> {
	token = "CreateRealEstateAssetForAssetGroupCommand";
	assetGroupIdentity!: string;
	address!: string;	
}

@injectable()
export class CreateRealEstateAssetForAssetGroupCommandHandler extends ICommandHandler<CreateRealEstateAssetForAssetGroupCommand, ResponseType> {
	constructor(
		@inject(assetFactory) private assetFactory: IAssetFactory,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(command: CreateRealEstateAssetForAssetGroupCommand): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const [realEstateAsset, asset] = await this.assetFactory.addRealEstateToAssetGroup({
				identity: command.assetGroupIdentity,
			}, command.address)

			await this.unitOfWork.commit();

			return {
				success: true,
				data: {
					asset,
					realEstateAsset
				}
			}
		} catch (error) {
			await this.unitOfWork.rollback();

			if (error instanceof Error) {
				return {
					success: false,
					message: error.message,
					httpCode: 500
				}
			}

			throw error;
		}
	}
}
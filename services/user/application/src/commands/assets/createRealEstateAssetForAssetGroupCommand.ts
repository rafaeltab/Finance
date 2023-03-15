// list a maximum of 30 asset groups

import { assetFactoryToken, IAssetFactory, Asset } from "@finance/svc-user-domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWorkToken } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<{
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
		@inject(assetFactoryToken) private assetFactory: IAssetFactory,
		@inject(unitOfWorkToken) private unitOfWork: IUnitOfWork
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
			throw error;
		}
	}
}
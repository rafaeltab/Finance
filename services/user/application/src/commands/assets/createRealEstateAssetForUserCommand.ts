// list a maximum of 30 asset groups

import { assetFactory, IAssetFactory, Asset } from "@finance/svc-user-domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWork } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<{
	asset: Asset,
	realEstateAsset: Asset
}>;

export class CreateRealEstateAssetForUserCommand extends ICommand<CreateRealEstateAssetForUserCommand, ResponseType> {
	token = "CreateRealEstateAssetForUserCommand";

	userIdentity!: string;

	address!: string;
}

@injectable()
export class CreateRealEstateAssetForUserCommandHandler extends ICommandHandler<CreateRealEstateAssetForUserCommand, ResponseType> {
	constructor(
		@inject(assetFactory) private assetFactory: IAssetFactory,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(command: CreateRealEstateAssetForUserCommand): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const [realEstateAsset, asset] = await this.assetFactory.addRealEstateToUser({
				identity: command.userIdentity,
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
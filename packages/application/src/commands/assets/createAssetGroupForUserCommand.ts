// list a maximum of 30 asset groups

import { AssetGroup, IAssetGroupFactory, assetGroupFactory } from "@finance/domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/libs-types";
import { IUnitOfWork, unitOfWork } from "@finance/postgres";
import { inject, injectable } from "tsyringe";

type ResponseType = ICommandResult<AssetGroup>;

export class CreateAssetGroupForUserCommand extends ICommand<CreateAssetGroupForUserCommand, ResponseType> {
	token = "CreateAssetGroupForUserCommand";
	userIdentity!: string;
	name!: string;
}

@injectable()
export class CreateAssetGroupForUserCommandHandler extends ICommandHandler<CreateAssetGroupForUserCommand, ResponseType> {
	constructor(
		@inject(assetGroupFactory) private assetGroupFactory: IAssetGroupFactory,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(command: CreateAssetGroupForUserCommand): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const assetGroup = await this.assetGroupFactory.addAssetGroupToUser({
				identity: command.userIdentity,
			}, command.name)

			await this.unitOfWork.commit();

			return {
				success: true,
				data: assetGroup
			}
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
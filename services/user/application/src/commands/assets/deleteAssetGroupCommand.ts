// list a maximum of 30 assetGroup groups

import { IAssetGroupRepository, assetGroupRepository } from "@finance/domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/libs-types";
import { IUnitOfWork, unitOfWork } from "@finance/postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<undefined>;

export class DeleteAssetGroupCommand extends ICommand<DeleteAssetGroupCommand, ResponseType> {
	token = "DeleteAssetGroupCommand";
	assetGroupIdentity!: string;
}

@injectable()
export class DeleteAssetGroupCommandHandler extends ICommandHandler<DeleteAssetGroupCommand, ResponseType> {
	constructor(
		@inject(assetGroupRepository) private assetGroupRepository: IAssetGroupRepository,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(command: DeleteAssetGroupCommand): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			await this.assetGroupRepository.delete({
				identity: command.assetGroupIdentity
			});

			await this.unitOfWork.commit();

			return {
				success: true,
				data: undefined
			}
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
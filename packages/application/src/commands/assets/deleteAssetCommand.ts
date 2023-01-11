// list a maximum of 30 asset groups

import { IAssetRepository, assetRepository } from "@finance/domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/libs-types";
import { IUnitOfWork, unitOfWork } from "@finance/postgres";
import { inject, injectable } from "tsyringe";

type ResponseType = ICommandResult<undefined>;

export class DeleteAssetCommand extends ICommand<DeleteAssetCommand, ResponseType> {
	token = "DeleteAssetCommand";
	assetIdentity!: string;
}

@injectable()
export class DeleteAssetCommandHandler extends ICommandHandler<DeleteAssetCommand, ResponseType> {
	constructor(
		@inject(assetRepository) private assetRepository: IAssetRepository,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(command: DeleteAssetCommand): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			await this.assetRepository.delete({
				identity: command.assetIdentity
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
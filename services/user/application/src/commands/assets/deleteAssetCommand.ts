// list a maximum of 30 asset groups

import { IAssetRepository, assetRepositoryToken } from "@finance/svc-user-domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWorkToken } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<undefined>;

export class DeleteAssetCommand extends ICommand<DeleteAssetCommand, ResponseType> {
	token = "DeleteAssetCommand";

	assetIdentity!: string;
}

@injectable()
export class DeleteAssetCommandHandler extends ICommandHandler<DeleteAssetCommand, ResponseType> {
	constructor(
		@inject(assetRepositoryToken) private assetRepository: IAssetRepository,
		@inject(unitOfWorkToken) private unitOfWork: IUnitOfWork
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
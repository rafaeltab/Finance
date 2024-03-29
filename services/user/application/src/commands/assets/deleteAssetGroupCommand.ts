// list a maximum of 30 assetGroup groups

import { IAssetGroupRepository, assetGroupRepositoryToken } from "@finance/svc-user-domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWorkToken } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<undefined>;

export class DeleteAssetGroupCommand extends ICommand<DeleteAssetGroupCommand, ResponseType> {
	token = "DeleteAssetGroupCommand";

	assetGroupIdentity!: string;
}

@injectable()
export class DeleteAssetGroupCommandHandler extends ICommandHandler<DeleteAssetGroupCommand, ResponseType> {
	constructor(
		@inject(assetGroupRepositoryToken) private assetGroupRepository: IAssetGroupRepository,
		@inject(unitOfWorkToken) private unitOfWork: IUnitOfWork
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
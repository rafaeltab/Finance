// list a maximum of 30 asset groups

import { Asset, IAssetRepository, assetRepository } from "@finance/svc-user-domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/lib-mediator";
import { unitOfWork, type IUnitOfWork } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";


export type ResponseType = IQueryResult<Asset>

export class GetAssetQuery extends IQuery<GetAssetQuery, ResponseType> {
	token = "GetAssetQuery";
	assetIdentity!: string;
}

@injectable()
export class GetAssetQueryHandler extends IQueryHandler<GetAssetQuery, ResponseType> {
	/**
	 *
	 */
	constructor(
		@inject(assetRepository) private assetRepository: IAssetRepository,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();

	}

	async handle(query: GetAssetQuery): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const asset = await this.assetRepository.get({
				identity: query.assetIdentity,
			});

			await this.unitOfWork.commit();

			return {
				success: true,
				data: asset
			}
		}
		catch (e: unknown) {
			await this.unitOfWork.rollback();
			throw e;
		}
	}
}
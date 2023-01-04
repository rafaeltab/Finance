// list a maximum of 30 asset groups

import { Asset, IAssetRepository, PaginatedBase, assetRepository } from "@finance/domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/libs-types";
import { IUnitOfWork, unitOfWork } from "@finance/postgres";
import { inject, injectable } from "tsyringe";

type ResponseType = IQueryResult<PaginatedBase<Asset>>

export class GetAssetsForAssetGroupQuery extends IQuery<GetAssetsForAssetGroupQuery, ResponseType> {
	token = "GetAssetsForAssetGroupQuery";
	assetGroupIdentity!: string;

	limit: number = 30;
	offset: number = 0;
}

@injectable()
export class GetAssetsForAssetGroupQueryHandler extends IQueryHandler<GetAssetsForAssetGroupQuery, ResponseType> {
	/**
	 *
	 */
	constructor(
		@inject(assetRepository) private assetRepository: IAssetRepository,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();

	}

	async handle(query: GetAssetsForAssetGroupQuery): Promise<ResponseType> {
		await this.unitOfWork.start();

		const assetGroups = await this.assetRepository.getAllAssetsForAssetGroup({
			identity: query.assetGroupIdentity,
		}, query.limit, query.offset);

		await this.unitOfWork.commit();

		return {
			success: true,
			data: {
				page: {
					count: assetGroups.page.count,
					offset: assetGroups.page.offset,
					total: assetGroups.page.total,
				},
				data: assetGroups.data
			}
		}
	}
}
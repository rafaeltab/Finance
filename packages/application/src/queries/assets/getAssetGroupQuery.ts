// list a maximum of 30 asset groups

import { Asset, AssetGroup, IAssetGroupRepository, IAssetRepository, PaginatedBase, assetGroupRepository, assetRepository } from "@finance/domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/libs-types";
import { IUnitOfWork, unitOfWork } from "@finance/postgres";
import { inject, injectable } from "tsyringe";

type ResponseType = IQueryResult<{
	group: AssetGroup,
	assets: PaginatedBase<Asset>
}>

export class GetAssetGroupQuery extends IQuery<GetAssetGroupQuery, ResponseType> {
	token = "GetAssetGroupQuery";
	assetGroupIdentity!: string;

	limit: number = 30;
	offset: number = 0;
}

@injectable()
export class GetAssetGroupQueryHandler extends IQueryHandler<GetAssetGroupQuery, ResponseType> {
	constructor(
		@inject(assetGroupRepository) private assetGroupRepository: IAssetGroupRepository,
		@inject(assetRepository) private assetRepository: IAssetRepository,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();

	}

	async handle(query: GetAssetGroupQuery): Promise<ResponseType> {
		try { 
			await this.unitOfWork.start();
	
			const assetGroup = await this.assetGroupRepository.get({
				identity: query.assetGroupIdentity,
			});

			const assets = await this.assetRepository.getAllAssetsForAssetGroup({
				identity: query.assetGroupIdentity,
			}, query.limit, query.offset);
	
			await this.unitOfWork.commit();
	
			return {
				success: true,
				data: {
					group: assetGroup,
					assets: {
						page: {
							count: assets.page.count,
							offset: assets.page.offset,
							total: assets.page.total,
						},
						data: assets.data
					}
				}
			}
		} catch (e: unknown) {
			await this.unitOfWork.rollback();

			if (e instanceof Error) {
				return {
					success: false,
					message: e.message,
					httpCode: e.message.includes("not found") ? 404 : 500
				}
			}
		}

		return {
			success: false,
			message: "Unknown error occured",
			httpCode: 500
		}
	}
}
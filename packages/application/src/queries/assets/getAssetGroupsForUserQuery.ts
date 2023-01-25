// list a maximum of 30 asset groups

import { IAssetGroupRepository, PaginatedBase, assetGroupRepository, AssetGroup } from "@finance/domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/libs-types";
import { unitOfWork, type IUnitOfWork } from "@finance/postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = IQueryResult<PaginatedBase<AssetGroup>>

export class GetAssetGroupsForUserQuery extends IQuery<GetAssetGroupsForUserQuery, ResponseType> {
	token = "GetAssetGroupsForUserQuery";
	userIdentity!: string;

	limit: number = 30;
	offset: number = 0;
}

@injectable()
export class GetAssetGroupsForUserQueryHandler extends IQueryHandler<GetAssetGroupsForUserQuery, ResponseType> {
	/**
	 *
	 */
	constructor(
		@inject(assetGroupRepository) private assetGroupRepository: IAssetGroupRepository,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
		
	}

	async handle(query: GetAssetGroupsForUserQuery): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();
			
			const assetGroups = await this.assetGroupRepository.getAllAssetGroupsForUser({
				identity: query.userIdentity,
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
		} catch (e: unknown) {
			await this.unitOfWork.rollback();
			throw e;
		}
	}
}
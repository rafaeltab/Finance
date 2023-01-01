// list a maximum of 30 asset groups

import { IAssetGroupRepository, PaginatedBase, assetGroupRepository } from "@finance/domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/libs-types";
import { inject, injectable } from "tsyringe";

type AssetGroupResponse = {
	identity: string;
	name: string;
}

type ResponseType = IQueryResult<PaginatedBase<AssetGroupResponse>>

export class GetAssetGroupsQuery extends IQuery<GetAssetGroupsQuery, ResponseType> {
	token = "GetAssetGroupsQuery";
	userIdentity!: string;

	limit: number = 30;
	offset: number = 0;
}

@injectable()
export class GetAssetGroupsQueryHandler extends IQueryHandler<GetAssetGroupsQuery, ResponseType> {
	/**
	 *
	 */
	constructor(@inject(assetGroupRepository) private assetGroupRepository: IAssetGroupRepository ) {
		super();
		
	}

	async handle(query: GetAssetGroupsQuery): Promise<ResponseType> {
		const assetGroups = await this.assetGroupRepository.getAllAssetGroupsForUser({
			identity: query.userIdentity,
		}, query.limit, query.offset);

		return {
			success: true,
			data: {
				page: {
					count: assetGroups.page.count,
					offset: assetGroups.page.offset,
					total: assetGroups.page.total,
				},
				data: assetGroups.data.map((assetGroup) => {
					return {
						identity: assetGroup.identity,
						name: assetGroup.name ?? "Unknown",
					};
				})
			}
		}
	}
}
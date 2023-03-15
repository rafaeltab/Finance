// list a maximum of 30 asset groups

import { IAssetGroupRepository, PaginatedBase, assetGroupRepositoryToken, AssetGroup } from "@finance/svc-user-domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/lib-mediator";
import { unitOfWorkToken, type IUnitOfWork } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = IQueryResult<PaginatedBase<AssetGroup>>

export class GetAssetGroupsForUserQuery extends IQuery<GetAssetGroupsForUserQuery, ResponseType> {
	token = "GetAssetGroupsForUserQuery";

	userIdentity!: string;

	limit = 30;

	offset = 0;
}

@injectable()
export class GetAssetGroupsForUserQueryHandler extends IQueryHandler<GetAssetGroupsForUserQuery, ResponseType> {
	/**
	 *
	 */
	constructor(
		@inject(assetGroupRepositoryToken) private assetGroupRepository: IAssetGroupRepository,
		@inject(unitOfWorkToken) private unitOfWork: IUnitOfWork
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
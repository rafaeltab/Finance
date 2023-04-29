// list a maximum of 30 asset groups

import { Asset, AssetGroup, IAssetGroupRepository, IAssetRepository, PaginatedBase, assetGroupRepositoryToken, assetRepositoryToken } from "@finance/svc-user-domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWorkToken } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = IQueryResult<{
	group: AssetGroup,
	assets: PaginatedBase<Asset>
}>

export class GetAssetGroupQuery extends IQuery<GetAssetGroupQuery, ResponseType> {
    token = "GetAssetGroupQuery";

    assetGroupIdentity!: string;

    limit = 30;

    offset = 0;
}

@injectable()
export class GetAssetGroupQueryHandler extends IQueryHandler<GetAssetGroupQuery, ResponseType> {
    constructor(
		@inject(assetGroupRepositoryToken) private assetGroupRepository: IAssetGroupRepository,
		@inject(assetRepositoryToken) private assetRepository: IAssetRepository,
		@inject(unitOfWorkToken) private unitOfWork: IUnitOfWork
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
            throw e;
        }
    }
}
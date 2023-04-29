// list a maximum of 30 asset groups

import { Asset, IAssetRepository, PaginatedBase, assetRepositoryToken } from "@finance/svc-user-domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/lib-mediator";
import { unitOfWorkToken, type IUnitOfWork } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";


export type ResponseType = IQueryResult<PaginatedBase<Asset>>

export class GetAssetsForUserQuery extends IQuery<GetAssetsForUserQuery, ResponseType> {
    token = "GetAssetsForUserQuery";

    userIdentity!: string;

    limit = 30;

    offset = 0;
}

@injectable()
export class GetAssetsForUserQueryHandler extends IQueryHandler<GetAssetsForUserQuery, ResponseType> {
    /**
	 *
	 */
    constructor(
		@inject(assetRepositoryToken) private assetRepository: IAssetRepository,
		@inject(unitOfWorkToken) private unitOfWork: IUnitOfWork
    ) {
        super();

    }

    async handle(query: GetAssetsForUserQuery): Promise<ResponseType> {
        try {
            await this.unitOfWork.start();

            const assets = await this.assetRepository.getAllAssetsForUser({
                identity: query.userIdentity,
            }, query.limit, query.offset);

            await this.unitOfWork.commit();

            return {
                success: true,
                data: {
                    page: {
                        count: assets.page.count,
                        offset: assets.page.offset,
                        total: assets.page.total,
                    },
                    data: assets.data
                }
            }
        } catch (e: unknown) {
            await this.unitOfWork.rollback();
            throw e;
        }
    }
}
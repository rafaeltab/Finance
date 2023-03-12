// list a maximum of 30 asset groups

import { Asset, IAssetRepository, PaginatedBase, assetRepository } from "@finance/domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/libs-types";
import { unitOfWork, type IUnitOfWork } from "@finance/postgres";
import { inject, injectable } from "tsyringe";


export type ResponseType = IQueryResult<PaginatedBase<Asset>>

export class GetAssetsForUserQuery extends IQuery<GetAssetsForUserQuery, ResponseType> {
	token = "GetAssetsForUserQuery";
	userIdentity!: string;

	limit: number = 30;
	offset: number = 0;
}

@injectable()
export class GetAssetsForUserQueryHandler extends IQueryHandler<GetAssetsForUserQuery, ResponseType> {
	/**
	 *
	 */
	constructor(
		@inject(assetRepository) private assetRepository: IAssetRepository,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
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
import { unitOfWork, UnitOfWork } from "../unitOfWork/unitOfWork";
import { EntityKey, IAssetRepository, PaginatedBase, Asset } from "@finance/domain";
import { inject, injectable } from "tsyringe";

@injectable()
export class AssetRepository implements IAssetRepository {
	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }


	async getAllAssetsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Asset>> {
		const res = await this._unitOfWork.getQueryRunner().manager.findAndCount(Asset, {
			where: {
				user: user
			},
			skip: offset,
			take: limit,
			relations: {
				realEstateAsset: true,
				stockAsset: true,
			}
		});

		return {
			page: {
				count: limit,
				offset: offset,
				total: res[1]
			},
			data: res[0]
		}
	}

	async getAllAssetsForAssetGroup(assetGroup: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Asset>> {
		const res = await this._unitOfWork.getQueryRunner().manager.findAndCount(Asset, {
			where: {
				group: assetGroup
			},
			skip: offset,
			take: limit,
			relations: {
				realEstateAsset: true,
				stockAsset: true,
			}
		});

		return {
			page: {
				count: limit,
				offset: offset,
				total: res[1]
			},
			data: res[0]
		}
	}

	async get(id: EntityKey): Promise<Asset> {
		const asset = await this._unitOfWork.getQueryRunner().manager.findOne(Asset, {
			where: id,
			relations: {
				stockAsset: true,
				realEstateAsset: true,
			}
		});

		if (!asset) {
			throw new Error("Asset not found");
		}

		return asset;
	}

	async delete(id: EntityKey): Promise<void> {
		await this._unitOfWork.getQueryRunner().manager.delete(Asset, id);
	}
}
import { unitOfWork, UnitOfWork } from "../unitOfWork/unitOfWork";
import { EntityKey, IAssetGroupRepository, PaginatedBase, AssetGroup } from "@finance/domain";
import { inject, injectable } from "tsyringe";

@injectable()
export class AssetGroupRepository implements IAssetGroupRepository {
	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }

	async getAllAssetGroupsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<AssetGroup>> {
		const res = await this._unitOfWork.getQueryRunner().manager.findAndCount(AssetGroup, {
			where: {
				user: user
			},
			skip: offset,
			take: limit,
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
	
	async get(id: EntityKey): Promise<AssetGroup> {
		const assetGroup = await this._unitOfWork.getQueryRunner().manager.findOne(AssetGroup, {
			where: id
		});

		if (!assetGroup) {
			throw new Error("Asset group not found");
		}

		return assetGroup;
	}

	async delete(id: EntityKey): Promise<void> {
		await this._unitOfWork.getQueryRunner().manager.delete(AssetGroup, id);
	}
}
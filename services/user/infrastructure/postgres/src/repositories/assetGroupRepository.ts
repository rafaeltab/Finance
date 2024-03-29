import { EntityKey, IAssetGroupRepository, PaginatedBase, AssetGroup, getKey } from "@finance/svc-user-domain";
import { EntryNotFoundError } from "@finance/lib-errors";
import { inject, injectable } from "tsyringe";
import { unitOfWorkToken, UnitOfWork } from "../unitOfWork/unitOfWork";

@injectable()
export class AssetGroupRepository implements IAssetGroupRepository {
	constructor(@inject(unitOfWorkToken) private unitOfWork: UnitOfWork) { }

	async getAllAssetGroupsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<AssetGroup>> {
		const res = await this.unitOfWork.getQueryRunner().manager.findAndCount(AssetGroup, {
			where: {
				user
			},
			skip: offset,
			take: limit,
		});

		return {
			page: {
				count: limit,
				offset,
				total: res[1]
			},
			data: res[0]
		}
	}
	
	async get(id: EntityKey): Promise<AssetGroup> {
		const assetGroup = await this.unitOfWork.getQueryRunner().manager.findOne(AssetGroup, {
			where: id,
		});

		if (!assetGroup) {
			throw new EntryNotFoundError(AssetGroup.name, getKey(id));
		}

		return assetGroup;
	}

	async delete(id: EntityKey): Promise<void> {
		const res = await this.unitOfWork.getQueryRunner().manager.delete(AssetGroup, id);
		if ((res.affected ?? 0)===0) { 
			throw new EntryNotFoundError(AssetGroup.name, getKey(id));
		}
	}
}
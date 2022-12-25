import { InjectionToken } from "tsyringe";
import { AssetGroup } from "../aggregates/AssetGroup";
import { EntityKey } from "../utils";
import { PaginatedBase } from "../utils/PaginatedBase";

export const assetGroupRepository: InjectionToken = "IAssetGroupRepository";

export interface IAssetGroupRepository {
	getAllAssetGroupsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<AssetGroup>>;

	get(id: EntityKey): Promise<AssetGroup>;

	delete(id: EntityKey): Promise<void>;
}
import type { InjectionToken } from "tsyringe";
import type { AssetGroup } from "../aggregates/AssetGroup";
import type { EntityKey } from "../utils";
import type { PaginatedBase } from "../utils/PaginatedBase";

export const assetGroupRepositoryToken: InjectionToken = "IAssetGroupRepository";

export interface IAssetGroupRepository {
	getAllAssetGroupsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<AssetGroup>>;

	get(id: EntityKey): Promise<AssetGroup>;

	delete(id: EntityKey): Promise<void>;
}
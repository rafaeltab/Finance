import type { InjectionToken } from "tsyringe";
import type { Asset } from "../aggregates/assetAggregate";
import type { EntityKey } from "../utils";
import type { PaginatedBase } from "../utils/PaginatedBase";

export const assetRepositoryToken: InjectionToken = "IAssetRepository";
export interface IAssetRepository {
	getAllAssetsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Asset>>;

	getAllAssetsForAssetGroup(assetGroup: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Asset>>;

	get(id: EntityKey): Promise<Asset>;

	delete(id: EntityKey): Promise<void>;
}
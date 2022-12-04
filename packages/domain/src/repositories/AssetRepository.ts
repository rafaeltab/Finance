import { InjectionToken } from "tsyringe";
import Asset from "../aggregates/assetAggregate";
import { EntityKey } from "../bases";
import { PaginatedBase } from "../bases/PaginatedBase";

export const groupRepository: InjectionToken = "IGroupRepository";

export interface IAssetRepository {
	getAllAssetsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Asset>>;

	get(id: EntityKey): Promise<Asset>;

	delete(id: EntityKey): Promise<void>;
}
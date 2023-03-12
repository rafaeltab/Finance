import type { InjectionToken } from "tsyringe";
import type { AssetGroup } from "../aggregates/AssetGroup";
import type { EntityKey } from "../utils";

export const assetGroupFactory: InjectionToken = "IAssetGroupFactory";
export interface IAssetGroupFactory {
	addAssetGroupToUser(user: EntityKey, name: string): Promise<AssetGroup>;
}
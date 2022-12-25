import { InjectionToken } from "tsyringe";
import { AssetGroup } from "../aggregates/AssetGroup";
import { EntityKey } from "../utils";

export const assetGroupFactory: InjectionToken = "IAssetGroupFactory";
export interface IAssetGroupFactory {
	addAssetGroupToUser(user: EntityKey, name: string): Promise<AssetGroup>;
}
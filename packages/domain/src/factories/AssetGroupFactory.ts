import { InjectionToken } from "tsyringe";
import { AssetGroup } from "../aggregates/AssetGroup";
import { EntityKey } from "../bases";

export const assetGroupFactory: InjectionToken = "IAssetGroupFactory";
export interface IAssetGroupFactory {
	addAssetGroupToUser(user: EntityKey, name: string): Promise<AssetGroup>;
}
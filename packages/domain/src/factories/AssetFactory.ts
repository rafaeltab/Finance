import { InjectionToken } from "tsyringe";
import Asset, { AssetValue, RealEstateAsset, StockAsset } from "../aggregates/assetAggregate";
import { EntityKey } from "../bases";

export const assetFactory: InjectionToken = "IAssetFactory";
export interface IAssetFactory {
	addStockToAssetGroup(assetGroup: EntityKey, amount: number, symbol: string, exchange: string): Promise<[StockAsset, Asset]>;
	addRealEstateToAssetGroup(assetGroup: EntityKey, address: string): Promise<[RealEstateAsset, Asset]>;

	addStockToUser(user: EntityKey, amount: number, symbol: string, exchange: string): Promise<[StockAsset, Asset]>;
	addRealEstateToUser(user: EntityKey, address: string): Promise<[RealEstateAsset, Asset]>;

	addValueToAsset(asset: EntityKey, value: Value): Promise<AssetValue>;
	addValuesToAsset(asset: EntityKey, value: Value[]): Promise<AssetValue[]>;
}

type Value = {
	usdValue: number;
	time: Date;
}

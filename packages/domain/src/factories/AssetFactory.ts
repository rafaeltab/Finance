import { InjectionToken } from "tsyringe";
import Asset, { AssetValue, RealEstateAsset, StockAsset } from "../aggregates/assetAggregate";
import { EntityKey } from "../bases";

export const assetFactory: InjectionToken = "IAssetFactory";
export interface IAssetFactory {
	addStockToAssetGroup(assetGroup: EntityKey, symbol: string, exchange: string, stockOrders: {amount: number, price: number}[]): Promise<[StockAsset, Asset]>;
	addRealEstateToAssetGroup(assetGroup: EntityKey, address: string): Promise<[RealEstateAsset, Asset]>;

	addStockToUser(user: EntityKey, symbol: string, exchange: string, stockOrders: { amount: number, price: number }[]): Promise<[StockAsset, Asset]>;
	addRealEstateToUser(user: EntityKey, address: string): Promise<[RealEstateAsset, Asset]>;

	addValueToAsset(asset: EntityKey, value: Value): Promise<AssetValue>;
	addValuesToAsset(asset: EntityKey, value: Value[]): Promise<AssetValue[]>;

	addStockOrderToStockAsset(asset: EntityKey, amount: number, price: number): Promise<StockAsset>;
}

type Value = {
	usdValue: number;
	time: Date;
}

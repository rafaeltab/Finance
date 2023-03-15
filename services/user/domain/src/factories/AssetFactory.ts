import type { InjectionToken } from "tsyringe";
import type { RealEstateAsset, StockAsset, Asset } from "../aggregates/assetAggregate";
import type { EntityKey } from "../utils";

export const assetFactory: InjectionToken = "IAssetFactory";
export interface IAssetFactory {
	addStockToAssetGroup(assetGroup: EntityKey, stockDataId: EntityKey, stockOrders: {amount: number, price: number}[]): Promise<[StockAsset, Asset]>;
	addRealEstateToAssetGroup(assetGroup: EntityKey, address: string): Promise<[RealEstateAsset, Asset]>;

	addStockToUser(user: EntityKey, stockDataId: EntityKey, stockOrders: { amount: number, price: number }[]): Promise<[StockAsset, Asset]>;
	addRealEstateToUser(user: EntityKey, address: string): Promise<[RealEstateAsset, Asset]>;

	addStockOrderToStockAsset(asset: EntityKey, amount: number, price: number): Promise<StockAsset>;
}
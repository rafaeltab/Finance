import { InjectionToken } from "tsyringe";
import Asset, { AssetValue } from "../aggregates/assetAggregate";
import { EntityKey } from "../bases";
import { PaginatedBase } from "../bases/PaginatedBase";

export const groupRepository: InjectionToken = "IGroupRepository";

export type ValueGranularity = "hour" | "day" | "week" | "month" | "year";

export type GranularValueResult = {
	startTime: Date,
	endTime: Date,
	minValue: number,
	maxValue: number,
	avgValue: number	
}

export interface IAssetRepository {
	getAllAssetsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Asset>>;

	getAllAssetsForAssetGroup(assetGroup: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Asset>>;

	get(id: EntityKey): Promise<Asset>;

	delete(id: EntityKey): Promise<void>;

	getValuesForAsset(asset: EntityKey, startDate: Date, endDate: Date, limit: number, offset: number): Promise<PaginatedBase<AssetValue>>;

	getGranularValuesForAsset(asset: EntityKey, startDate: Date, endDate: Date, granularity: ValueGranularity, limit: number, offset: number): Promise<PaginatedBase<GranularValueResult>>;
}
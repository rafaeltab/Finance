import { InjectionToken } from "tsyringe";
import { StockAssetKind, StockData, StockValue } from "../aggregates";
import { EntityKey } from "../bases";

export type InsertStockValue = {
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	date: Date;
}

export type InsertEvent = {
	date: Date;
	value: number;
}

export const stockFactory: InjectionToken = "IStockFactory";


export interface IStockFactory { 
	addStockData(symbol: string, exchange: string, assetKind: StockAssetKind): Promise<StockData>;

	addStockValues(stockData: EntityKey, values: InsertStockValue[]): Promise<StockValue[]>;
	
	addStockDividendEvents(stockData: EntityKey, events: InsertEvent[]): Promise<InsertEvent[]>;

	addStockSplitEvents(stockData: EntityKey, events: InsertEvent[]): Promise<InsertEvent[]>;
}
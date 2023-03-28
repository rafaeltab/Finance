import type { InjectionToken } from "tsyringe";
import type { StockAssetKind, StockData, StockDividendEvent, StockSplitEvent, StockValue } from "../aggregates";
import type { EntityKey } from "../utils";

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

export const stockFactoryToken: InjectionToken = "IStockFactory";


export interface IStockFactory { 
	addStockData(symbol: string, exchange: string, assetKind: StockAssetKind): Promise<StockData>;

	addStockValues(stockData: EntityKey, values: InsertStockValue[]): Promise<StockValue[]>;
	
	addStockDividendEvents(stockData: EntityKey, events: InsertEvent[]): Promise<StockDividendEvent[]>;

	addStockSplitEvents(stockData: EntityKey, events: InsertEvent[]): Promise<StockSplitEvent[]>;
}
import { InjectionToken } from "tsyringe";
import { StockAssetKind, StockData, StockValue } from "../aggregates";
import { StockDividendEvent } from "../aggregates/stockAggregate/StockDividendEvent";
import { StockSplitEvent } from "../aggregates/stockAggregate/StockSplitEvent";
import { EntityKey, PaginatedBase } from "../bases";

export type ValueGranularity = "minute" | "hour" | "day" | "week" | "month" | "year";

export const stockRepository: InjectionToken = "IStockRepository";


export interface IStockRepository  {
	/** return all stock data entries, optionally with a max year value history with monthly accuracy */
	getAllStockData(withValues?: boolean, limit?: number, offset?: number): Promise<PaginatedBase<StockData>>;

	/** Get stock values for a specific stock, for a certain time range, with pagination. Granularity can be used to define the interval between values */
	getStockValues(stockDataId: EntityKey, granularity: ValueGranularity, timerange: TimeRange, limit?: number, offset?: number): Promise<PaginatedBase<StockValue>>;

	/** Get stock events for a specific stock, for a certain time range, with pagination.  */
	getStockEvents(stockDataId: EntityKey, timerange: TimeRange, limit?: number, offset?: number): Promise<[StockDividendEvent[], StockSplitEvent[]]>;

	/** search for stock data based on some input */
	searchStockData(symbol?: string, exchange?: string, stockAssetKind?: StockAssetKind, withValues?: boolean, limit?: number, offset?: number): Promise<PaginatedBase<StockData>>;
}


export class TimeRange {
	constructor(private _start: Date, private _end: Date) { }

	get start() { return this._start }
	get end() { return this._end }

	static fromDay(day: Date) {
		const date = day.getDate() 
		const month = day.getMonth()
		const year = day.getFullYear()

		var start = new Date(year, month, date, 0, 0, 0, 0);
		var end = new Date(year, month, date, 23, 59, 59, 999);

		return new TimeRange(start, end);
	}
}
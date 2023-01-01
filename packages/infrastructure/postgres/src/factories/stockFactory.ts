import { unitOfWork, UnitOfWork } from "../unitOfWork/unitOfWork";
import { EntityKey, IStockFactory, InsertEvent, InsertStockValue, StockAssetKind, StockData, StockDividendEvent, StockValue, StockSplitEvent } from "@finance/domain";
import { inject, injectable } from "tsyringe";

@injectable()
export class StockFactory implements IStockFactory {
	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }

	async addStockData(symbol: string, exchange: string, assetKind: StockAssetKind): Promise<StockData> {
		var stockData = new StockData({
			assetKind: assetKind,
			exchange: exchange,
			symbol: symbol,
			identity: `stockData-${assetKind}-${exchange}-${symbol}`
		});

		await this._unitOfWork.getQueryRunner().manager.save([stockData]);
		return stockData;
	}

	async addStockValues(stockDataId: EntityKey, values: InsertStockValue[]): Promise<StockValue[]> {
		var stockData = await this._unitOfWork.getQueryRunner().manager.findOne(StockData, {
			where: stockDataId,
		});

		if (stockData === undefined || stockData === null) {
			throw new Error("Stock data not found");
		}

		var stockValues = values.map(value => new StockValue({
			stockData: stockData!,
			date: value.date,
			open: value.open,
			high: value.high,
			low: value.low,
			close: value.close,
			volume: value.volume
		}));

		await this._unitOfWork.getQueryRunner().manager.insert(StockValue, stockValues);
		return stockValues;
	}

	async addStockDividendEvents(stockDataId: EntityKey, events: InsertEvent[]): Promise<StockDividendEvent[]> {
		var stockData = await this._unitOfWork.getQueryRunner().manager.findOne(StockData, {
			where: stockDataId,
		});

		if (stockData === undefined || stockData === null) {
			throw new Error("Stock data not found");
		}

		var stockDividendEvents = events.map(event => new StockDividendEvent({
			stockData: stockData!,
			date: event.date,
			amount: event.value,
		}));

		await this._unitOfWork.getQueryRunner().manager.save(stockDividendEvents);
		return stockDividendEvents;
	}

	async addStockSplitEvents(stockDataId: EntityKey, events: InsertEvent[]): Promise<StockSplitEvent[]> {
		var stockData = await this._unitOfWork.getQueryRunner().manager.findOne(StockData, {
			where: stockDataId,
		});

		if (stockData === undefined || stockData === null) {
			throw new Error("Stock data not found");
		}

		var stockDividendEvents = events.map(event => new StockSplitEvent({
			stockData: stockData!,
			date: event.date,
			ratio: event.value,
		}));

		await this._unitOfWork.getQueryRunner().manager.save(stockDividendEvents);
		return stockDividendEvents;
	}
}
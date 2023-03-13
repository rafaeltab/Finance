import { EntityKey, IStockFactory, InsertEvent, InsertStockValue, StockAssetKind, StockData, StockDividendEvent, StockValue, StockSplitEvent, getKey } from "@finance/svc-user-domain";
import { EntryNotFoundError } from "@finance/lib-errors";
import { inject, injectable } from "tsyringe";
import { unitOfWork, UnitOfWork } from "../unitOfWork/unitOfWork";

@injectable()
export class StockFactory implements IStockFactory {
	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }

	async addStockData(symbol: string, exchange: string, assetKind: StockAssetKind): Promise<StockData> {
		const stockData = new StockData({
			assetKind,
			exchange,
			symbol,
			identity: `stockData-${assetKind}-${exchange}-${symbol}`
		});

		await this._unitOfWork.getQueryRunner().manager.save([stockData]);
		return stockData;
	}

	async addStockValues(stockDataId: EntityKey, values: InsertStockValue[]): Promise<StockValue[]> {
		const stockData = await this._unitOfWork.getQueryRunner().manager.findOne(StockData, {
			where: stockDataId,
		});

		if (stockData === undefined || stockData === null) {
			throw new EntryNotFoundError(StockData.name, getKey(stockDataId));
		}

		const stockValues = values.map(value => new StockValue({
			stockData: stockData!,
			date: value.date,
			open: value.open,
			high: value.high,
			low: value.low,
			close: value.close,
			volume: value.volume
		}));

		const chunkSize = 5000;

		if (stockValues.length > chunkSize) {
			for (let i = 0; i < stockValues.length+5; i += chunkSize) {
				const chunk = stockValues.slice(i, i + chunkSize);
				if (chunk.length === 0) continue;
				await this._unitOfWork.getQueryRunner().manager.insert(StockValue, chunk);
			}
			return stockValues;
		}

		await this._unitOfWork.getQueryRunner().manager.insert(StockValue, stockValues);
		return stockValues;
	}

	async addStockDividendEvents(stockDataId: EntityKey, events: InsertEvent[]): Promise<StockDividendEvent[]> {
		const stockData = await this._unitOfWork.getQueryRunner().manager.findOne(StockData, {
			where: stockDataId,
		});

		if (stockData === undefined || stockData === null) {
			throw new EntryNotFoundError(StockData.name, getKey(stockDataId));
		}

		const stockDividendEvents = events.map(event => new StockDividendEvent({
			stockData: stockData!,
			date: event.date,
			amount: event.value,
		}));

		await this._unitOfWork.getQueryRunner().manager.save(stockDividendEvents);
		return stockDividendEvents;
	}

	async addStockSplitEvents(stockDataId: EntityKey, events: InsertEvent[]): Promise<StockSplitEvent[]> {
		const stockData = await this._unitOfWork.getQueryRunner().manager.findOne(StockData, {
			where: stockDataId,
		});

		if (stockData === undefined || stockData === null) {
			throw new EntryNotFoundError(StockData.name, getKey(stockDataId));
		}

		const stockDividendEvents = events.map(event => new StockSplitEvent({
			stockData: stockData!,
			date: event.date,
			ratio: event.value,
		}));

		await this._unitOfWork.getQueryRunner().manager.save(stockDividendEvents);
		return stockDividendEvents;
	}
}
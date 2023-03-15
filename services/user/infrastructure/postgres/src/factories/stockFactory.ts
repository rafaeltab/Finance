import { EntityKey, IStockFactory, InsertEvent, InsertStockValue, StockAssetKind, StockData, StockDividendEvent, StockValue, StockSplitEvent, getKey } from "@finance/svc-user-domain";
import { EntryNotFoundError } from "@finance/lib-errors";
import { inject, injectable } from "tsyringe";
import { unitOfWorkToken, UnitOfWork } from "../unitOfWork/unitOfWork";

@injectable()
export class StockFactory implements IStockFactory {
	constructor(@inject(unitOfWorkToken) private unitOfWork: UnitOfWork) { }

	async addStockData(symbol: string, exchange: string, assetKind: StockAssetKind): Promise<StockData> {
		const stockData = new StockData({
			assetKind,
			exchange,
			symbol,
			identity: `stockData-${assetKind}-${exchange}-${symbol}`
		});

		await this.unitOfWork.getQueryRunner().manager.save([stockData]);
		return stockData;
	}

	async addStockValues(stockDataId: EntityKey, values: InsertStockValue[]): Promise<StockValue[]> {
		const stockData = await this.unitOfWork.getQueryRunner().manager.findOne(StockData, {
			where: stockDataId,
		});

		if (stockData === undefined || stockData === null) {
			throw new EntryNotFoundError(StockData.name, getKey(stockDataId));
		}

		const stockValues = values.map(value => new StockValue({
			stockData,
			date: value.date,
			open: value.open,
			high: value.high,
			low: value.low,
			close: value.close,
			volume: value.volume
		}));

		const chunkSize = 5000;

		const promises: Promise<unknown>[] = [];

		if (stockValues.length > chunkSize) {
			for (let i = 0; i < stockValues.length+5; i += chunkSize) {
				const chunk = stockValues.slice(i, i + chunkSize);
				if (chunk.length === 0) continue;
				promises.push(this.unitOfWork.getQueryRunner().manager.insert(StockValue, chunk));
			}
			return stockValues;
		}

		await Promise.all(promises);
		await this.unitOfWork.getQueryRunner().manager.insert(StockValue, stockValues);
		return stockValues;
	}

	async addStockDividendEvents(stockDataId: EntityKey, events: InsertEvent[]): Promise<StockDividendEvent[]> {
		const stockData = await this.unitOfWork.getQueryRunner().manager.findOne(StockData, {
			where: stockDataId,
		});

		if (stockData === undefined || stockData === null) {
			throw new EntryNotFoundError(StockData.name, getKey(stockDataId));
		}

		const stockDividendEvents = events.map(event => new StockDividendEvent({
			stockData,
			date: event.date,
			amount: event.value,
		}));

		await this.unitOfWork.getQueryRunner().manager.save(stockDividendEvents);
		return stockDividendEvents;
	}

	async addStockSplitEvents(stockDataId: EntityKey, events: InsertEvent[]): Promise<StockSplitEvent[]> {
		const stockData = await this.unitOfWork.getQueryRunner().manager.findOne(StockData, {
			where: stockDataId,
		});

		if (stockData === undefined || stockData === null) {
			throw new EntryNotFoundError(StockData.name, getKey(stockDataId));
		}

		const stockDividendEvents = events.map(event => new StockSplitEvent({
			stockData,
			date: event.date,
			ratio: event.value,
		}));

		await this.unitOfWork.getQueryRunner().manager.save(stockDividendEvents);
		return stockDividendEvents;
	}
}
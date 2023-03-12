import { StockFactory } from "#src/factories/stockFactory";
import { StockRepository } from "#src/repositories/stockRepository";
import { InsertStockValue, StockAssetKind, TimeRange } from "@finance/svc-user-domain";
import "reflect-metadata";
import { DbFixture, TestDataType } from "../test-utils/dbfixture";
import { expectNotNullOrUndefined, expectRequiredProps } from "#tests/test-utils/expectUtils";

let fixture: DbFixture;
let testData: TestDataType;

let stockFactory: StockFactory;
let stockRepository: StockRepository;

beforeAll(async () => {
	fixture = await DbFixture.getInstance();
	testData = fixture.getTestData();
}, 20000);

beforeEach(async () => {
	await fixture.resetUnitOfWork();
	stockFactory = fixture.getInstance(StockFactory);
	stockRepository = fixture.getInstance(StockRepository);
});

afterAll(async () => {
	await fixture.destroy();
});

describe("addStockData", () => {
	test('addStockData should insert stock data into the database', async () => {
		const data = {
			symbol: "AAPL",
			exchange: "NASDAQ",
			stockKind: StockAssetKind.CS,
		}

		const stockData = await stockFactory.addStockData(data.symbol, data.exchange, data.stockKind);

		expectNotNullOrUndefined(stockData);
		expectRequiredProps(stockData, ["uniqueId", "assetKind", "symbol", "exchange"]);

		expect(stockData.assetKind).toBe(data.stockKind);
		expect(stockData.symbol).toBe(data.symbol);
		expect(stockData.exchange).toBe(data.exchange);

		const result = await stockRepository.searchStockData(data.symbol, data.exchange, data.stockKind);

		expectNotNullOrUndefined(result);
		expectRequiredProps(result, ["data"]);

		expect(result.data.length).toBe(1);

		expectNotNullOrUndefined(result.data[0]);

		expect(result.data[0].assetKind).toBe(data.stockKind);
		expect(result.data[0].symbol).toBe(data.symbol);
		expect(result.data[0].exchange).toBe(data.exchange);
	});
});

describe("addStockValues", () => {
	test('addStockValues should add values to a stock', async () => {
		var inFiveMinutes = new Date()
		inFiveMinutes.setMinutes(inFiveMinutes.getMinutes() + 5);

		const data = {
			values: [{
				date: inFiveMinutes,
				open: 100,
				high: 200,
				low: 50,
				close: 150,
				volume: 32479,
			}] as [InsertStockValue],
		}

		const stockValues = await stockFactory.addStockValues({
			uniqueId: testData.googlStockData.uniqueId,
		}, data.values);

		expectNotNullOrUndefined(stockValues);

		expect(stockValues.length).toBe(1);

		expectNotNullOrUndefined(stockValues[0]);

		expect(stockValues[0].date).toBe(data.values[0].date);
		expect(stockValues[0].open).toBe(data.values[0].open);
		expect(stockValues[0].high).toBe(data.values[0].high);
		expect(stockValues[0].low).toBe(data.values[0].low);
		expect(stockValues[0].close).toBe(data.values[0].close);
		expect(stockValues[0].volume).toBe(data.values[0].volume);


		const result = await stockRepository.getStockValues({
			uniqueId: testData.googlStockData.uniqueId,
		}, "minute", TimeRange.halfDayAroundNow(new Date()), 100, 0);

		expectNotNullOrUndefined(result);
		expectRequiredProps(result, ["data"]);
		
		expect(result.data.length).toBe(testData.googStockValues.length + 1);

		const inserted = result.data.find(x => x.volume == data.values[0].volume);

		expectNotNullOrUndefined(inserted);

		expect(inserted.date).toStrictEqual(data.values[0].date);
		expect(inserted.open).toBe(data.values[0].open);
		expect(inserted.high).toBe(data.values[0].high);
		expect(inserted.low).toBe(data.values[0].low);
		expect(inserted.close).toBe(data.values[0].close);
		expect(inserted.volume).toBe(data.values[0].volume);
	});
});
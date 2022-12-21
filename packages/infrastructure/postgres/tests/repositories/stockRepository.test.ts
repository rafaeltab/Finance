import "reflect-metadata";
import { DbFixture, TestDataType } from "../test-utils/dbfixture";
import { IStockRepository, StockAssetKind, TimeRange } from "@finance/domain";
import { StockRepository } from "#src/repositories/stockRepository";

let fixture: DbFixture;
let testData: TestDataType;

let stockRepository: IStockRepository;

beforeAll(async () => {
	fixture = await DbFixture.getInstance();
	testData = fixture.getTestData();
}, 20000);

beforeEach(async () => {
	await fixture.resetUnitOfWork();
	stockRepository = fixture.getInstance(StockRepository);
});

afterAll(async () => {
	await fixture.destroy();
});

describe("getAllStockData", () => {
	test('getAllStockData without pagination should return all stock data and no values', async () => {
		const stockData = await stockRepository.getAllStockData();
		expect(stockData).toBeDefined();
		expect(stockData.data.length).toBe(testData.testData.StockData.length);
	});

	test('getAllStockData withValues enabled should return stock data with one value per month for the last two years', async () => {
		const stockData = await stockRepository.getAllStockData(true, 1, 0);
		expect(stockData).toBeDefined();
		expect(stockData.data.length).toBe(1);
		expect(stockData.data[0].values).toBeDefined();
		expect(stockData.data[0].values.length).toBe(1); //only one because the test data has small interval in the same month
	});
});

describe("getStockValues", () => {
	test('getStockValues without pagination and minute granularity should return all stock values with a maximum of 500', async () => {
		const stockValues = await stockRepository.getStockValues({ identity: testData.googlStockData.identity }, "minute",
		TimeRange.fromDay(new Date()));
		expect(stockValues).toBeDefined();
		expect(stockValues.data.length).toBe(Math.min(testData.testData.StockValue.length, 500));
	});

	test('getStockValues without pagination and hour granularity should return hourly stock values with a maximum of 500', async () => {
		const stockValues = await stockRepository.getStockValues({ identity: testData.googlStockData.identity }, "hour",
			TimeRange.fromDay(new Date()));
		expect(stockValues).toBeDefined();
		expect(stockValues.data.length).toBe(1);
	});
});

describe("getStockEvents", () => {
	test('getStockEvents should return all stock events', async () => {
		const [dividendEvents, splitEvents] = await stockRepository.getStockEvents({ identity: testData.googlStockData.identity },
			TimeRange.fromDay(new Date()));
		expect(dividendEvents).toBeDefined();
		expect(splitEvents).toBeDefined();
		expect(dividendEvents.length).toBe(testData.testData.StockDividendEvent.length);
		expect(splitEvents.length).toBe(testData.testData.StockSplitEvent.length);
	});
});

describe("searchStockData", () => {
	test('searchStockData should filter on symbol', async () => {
		const stockData = await stockRepository.searchStockData("GOOG");

		expect(stockData).toBeDefined();
		expect(stockData.data.length).toBe(1);
		expect(stockData.data[0].symbol).toBe(testData.googlStockData.symbol);
		expect(stockData.data[0].exchange).toBe(testData.googlStockData.exchange);

	});

	test('searchStockData should filter on exchange', async () => {
		const stockData = await stockRepository.searchStockData(undefined, "NAS");

		expect(stockData).toBeDefined();
		expect(stockData.data.length).toBe(1);
		expect(stockData.data[0].symbol).toBe(testData.googlStockData.symbol);
		expect(stockData.data[0].exchange).toBe(testData.googlStockData.exchange);
	});

	test('searchStockData should filter on ', async () => {
		const stockData = await stockRepository.searchStockData(undefined, undefined, StockAssetKind.CS);

		expect(stockData).toBeDefined();
		expect(stockData.data.length).toBe(1);
		expect(stockData.data[0].symbol).toBe(testData.googlStockData.symbol);
		expect(stockData.data[0].exchange).toBe(testData.googlStockData.exchange);
	});
});
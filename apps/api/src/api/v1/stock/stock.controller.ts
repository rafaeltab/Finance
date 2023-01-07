import { Controller, Get, Inject, Query, Param, HttpException, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Mediator } from "@finance/libs-types";
import { StocksDataListViewQuery, StockDataSearchQuery, StockDataViewQuery, CreateStockDatasCommand } from "@finance/application";
import { Put } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { parse as csvParse } from "csv-parse";
import { StockAssetKind } from "@finance/domain";

@Controller("/api/v1/stock")
export class StockController {
	constructor(@Inject(Mediator) private readonly mediator: Mediator) { }

	@Get("/search")
	async getSearch(
		@Query("exchange") exchange: string,
		@Query("symbol") symbol: string,
		@Query("type") type: string
	) {
		const queryResult = await this.mediator.query(new StockDataSearchQuery({
			exchange: exchange,
			symbol: symbol,
			type: type,
			limit: 30,
			offset: 0
		}));

		if (queryResult.success) {
			return queryResult;
		}

		throw new HttpException(queryResult.message, queryResult.httpCode ?? 500);
	}

	@Get("/:identity")
	async get(
		@Param("identity") identity: string
	) {
		const queryResult =  await this.mediator.query(new StockDataViewQuery({
			stockDataIdentity: identity,
			offset: 0,
			limit: 30
		}));

		if (queryResult.success) {
			return queryResult;
		}

		throw new HttpException(queryResult.message, queryResult.httpCode ?? 500);
	}

	@Get()
	async getStocks() {
		const queryResult = await this.mediator.query(new StocksDataListViewQuery({
			limit: 30,
			offset: 0
		}))

		if (queryResult.success) {
			return queryResult;
		}

		throw new HttpException(queryResult.message, queryResult.httpCode ?? 500);
	}

	@Put("data/csv")
		@UseInterceptors(FileInterceptor('stockData'))
	async createDataFromCsv(
		@UploadedFile() stockData: Express.Multer.File
	) {
		const parsed = await parseCsv(stockData.buffer);
		
		const commandResult = await this.mediator.command(new CreateStockDatasCommand({
			stockDatas: parsed
		}))

		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}
}

type StockData = {
	symbol: string,
	exchange: string,
	type: StockAssetKind
}

async function parseCsv(csv: Buffer): Promise<StockData[]> {
	const parsed = await csvParse(csv, {
		columns: true,
		skip_empty_lines: true
	});

	const data: StockData[] = []

	for await (const row of parsed) {
		const symbol = row.SYMBOL ?? row.Symbol ?? row.symbol;

		if (!symbol) {
			throw new Error("symbol is required");
		}

		if (!row.EXCHANGE) {
			row.EXCHANGE = "NASDAQ";
		}

		if (!row.TYPE) {
			row.TYPE = StockAssetKind.CS;
		}

		data.push({ symbol: symbol, exchange: row.EXCHANGE, type: row.TYPE });
	}

	return data;
}
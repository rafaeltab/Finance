import { AddValuesToStockDataCommand, CreateStockDatasCommand, StockDataSearchQuery, StockDataViewQuery, StocksDataListViewQuery } from "@finance/svc-user-application";
import { InsertStockValue, StockAssetKind } from "@finance/svc-user-domain";
import { DuplicateEntryError, EntryNotFoundError } from "@finance/lib-errors";
import { FinanceErrors } from "@finance/lib-errors-nest";
import { IQueryResult, Mediator } from "@finance/lib-mediator";
import { Controller, Get, HttpException, Inject, Param, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Put } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { parse as csvParse } from "csv-parse";
import JsZip from 'jszip';
import { GetSearchStockResponse, GetStockListResponse, StockDataViewResponse } from "./stock.responses";

@Controller("/api/v1/stock")
export class StockController {
	constructor(@Inject(Mediator) private readonly mediator: Mediator) { }

	@Get("/search")
	@FinanceErrors([])
	@ApiBearerAuth("oauth2")
	@ApiOkResponse({
		type: GetSearchStockResponse
	})
	async getSearch(
		@Query("exchange") exchange: string,
		@Query("symbol") symbol: string,
		@Query("type") type: string
	): Promise<GetSearchStockResponse> {
		return GetSearchStockResponse.map(await this.mediator.query(new StockDataSearchQuery({
			exchange,
			symbol,
			type,
			limit: 30,
			offset: 0
		})));
	}

	@Get("/:identity")
	@FinanceErrors([EntryNotFoundError])
	@ApiBearerAuth("oauth2")
	@ApiOkResponse({
		type: StockDataViewResponse
	})
	async get(
		@Param("identity") identity: string
	): Promise<StockDataViewResponse> {
		return StockDataViewResponse.map(await this.mediator.query(new StockDataViewQuery({
			stockDataIdentity: identity,
			offset: 0,
			limit: 30
		})));
	}

	@Get()
	@FinanceErrors([])
	@ApiBearerAuth("oauth2")
	@ApiOkResponse({
		type: GetStockListResponse
	})
	async getStocks() {
		return GetStockListResponse.map(await this.mediator.query(new StocksDataListViewQuery({
			limit: 30,
			offset: 0
		})));
	}

	@Put("data/csv")
	@UseInterceptors(FileInterceptor('stockData'))
	@FinanceErrors([DuplicateEntryError])
	@ApiBearerAuth("oauth2")
	async createDataFromCsv(
		@UploadedFile() stockData: Express.Multer.File
	) {
		if (stockData.mimetype !== "text/csv") {
			throw new HttpException("Invalid file type, csv expected.", 400);
		}

		const parsed = await parseDataCsv(stockData.buffer);

		return this.mediator.command(new CreateStockDatasCommand({
			stockDatas: parsed
		}))
	}

	@Put("values/csv")
	@UseInterceptors(FileInterceptor('stockValues'))
	@FinanceErrors([DuplicateEntryError])
	@ApiBearerAuth("oauth2")
	async createValuesFromCsv(
		@UploadedFile() stockValues: Express.Multer.File
	) {
		// if not zip, throw error
		if (stockValues.mimetype !== "application/zip") {
			throw new HttpException("Invalid file type, csv expected.", 400);
		}

		const zip = new JsZip();

		const zipFile = await zip.loadAsync(stockValues.buffer)

		let previousInsert: Promise<IQueryResult<unknown>> | undefined;
		let previousStock: string | undefined;

		const failed: string[] = [];

		for (const fileName of Object.keys(zipFile.files)) {
			const file = zipFile.files[fileName];

			if (file === undefined) {
				continue;
			}

			if (file?.dir == true) {
				continue;
			}

			const fileContent = await file?.async("nodebuffer")

			if (!fileContent) {
				continue;
			}

			if (!fileName.endsWith(".csv")) {
				continue;
			}

			if (!fileName.includes("1d")) {
				continue;
			}

			if (!fileName.includes("ohclv")) {
				continue;
			}

			const stock = fileName.split("ohclv/")[1]?.split("/")[0];

			try {
				var search = await this.mediator.query(new StockDataSearchQuery({
					exchange: "NASDAQ",
					symbol: stock,
					type: StockAssetKind.CS,
					limit: 30,
					offset: 0
				}));
			} catch (e) {
				failed.push(stock ?? "UNKNOWN");
				continue;
			}

			if (search.data.isEmpty === true) {
				failed.push(stock ?? "UNKNOWN");
				continue;
			}

			let identity = search.data.data[0]?.identity!;

			if (search.data.data.length > 1) {
				const found = search.data.data.find(x => x.symbol === stock);
				if (found === undefined) {
					failed.push(stock ?? "UNKNOWN");
					continue;
				}
				identity = found.identity;
			}

			const values = await parseValuesCsv(fileContent);
			if (previousInsert !== undefined) {
				try {
					await previousInsert;
				} catch (e) {
					failed.push(previousStock ?? "UNKNOWN");
					console.log(`Store values failed for ${  previousStock}` ?? "UNKNOWN")
					continue;
				}

				console.log(`Stored values for ${  previousStock}` ?? "UNKNOWN")
			}

			previousInsert = this.mediator.command(new AddValuesToStockDataCommand({
				stockDataIdentity: identity,
				values
			}));
			previousStock = stock;
		}

		await previousInsert;

		return {
			failed
		}
	}
}

type StockData = {
	symbol: string,
	exchange: string,
	type: StockAssetKind
}

async function parseValuesCsv(csv: Buffer): Promise<InsertStockValue[]> {
	const parsed = await csvParse(csv, {
		columns: true,
		skip_empty_lines: true
	});

	const data: InsertStockValue[] = []

	for await (const row of parsed) {
		const date = row.DATE ?? row.Date ?? row.date;

		if (!date) {
			continue;
		}

		const open = row.OPEN ?? row.Open ?? row.open;

		if (!open) {
			continue;
		}

		const high = row.HIGH ?? row.High ?? row.high;

		if (!high) {
			continue;
		}

		const low = row.LOW ?? row.Low ?? row.low;

		if (!low) {
			continue;
		}

		const close = row.CLOSE ?? row.Close ?? row.close;

		if (!close) {
			continue;
		}

		const volume = row.VOLUME ?? row.Volume ?? row.volume;

		if (!volume) {
			continue;
		}

		data.push({
			date: new Date(date),
			open: parseFloat(open),
			high: parseFloat(high),
			low: parseFloat(low),
			close: parseFloat(close),
			volume: parseInt(volume)
		})
	}

	return data;
}

async function parseDataCsv(csv: Buffer): Promise<StockData[]> {
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

		data.push({ symbol, exchange: row.EXCHANGE, type: row.TYPE });
	}

	return data;
}
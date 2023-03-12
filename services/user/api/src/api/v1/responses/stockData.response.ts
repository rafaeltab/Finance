import { StockAssetKind, StockData, StockValue } from "@finance/domain";
import { ApiProperty } from "@nestjs/swagger";
import { EntityResponse } from "./identity.response";

export class StockDataResponse extends EntityResponse { 
	@ApiProperty({
		type: "string"
	})
	symbol!: string;

	@ApiProperty({
		type: "string"
	})
	exchange!: string;

	@ApiProperty({
		type: "string",
		enum: StockAssetKind
	})
	assetKind!: StockAssetKind;

	static map(data: StockData): StockDataResponse {
		return {
			symbol: data.symbol ?? "",
			exchange: data.exchange ?? "",
			assetKind: data.assetKind ?? StockAssetKind.CS,
			identity: data.identity
		};
	}
}

export class StockValueResponse {
	@ApiProperty({
		type: "number"
	})
	open?: number;

	@ApiProperty({
		type: "number"
	})
	high?: number;

	@ApiProperty({
		type: "number"
	})
	low?: number;

	@ApiProperty({
		type: "number"
	})
	close?: number;

	@ApiProperty({
		type: "integer"
	})
	volume?: number;

	static map(data: StockValue): StockValueResponse {
		return {
			open: data.open,
			high: data.high,
			low: data.low,
			close: data.close,
			volume: data.volume
		};
	}
}
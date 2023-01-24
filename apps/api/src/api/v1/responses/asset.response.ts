import { ApiProperty } from "@nestjs/swagger";
import { StockDataResponse } from "./stockData.response";
import type { Asset } from "@finance/domain";

export class StockOrderResponse { 
	@ApiProperty({
		type: "number"
	})
	amount?: number;

	@ApiProperty({
		type: "number"
	})
	usdPrice?: number;

	static map(order: StockOrderResponse): StockOrderResponse {
		return {
			amount: order.amount ?? 0,
			usdPrice: order.usdPrice ?? 0
		}
	}
}

export class StockAssetResponse { 
	@ApiProperty({
		type: [StockOrderResponse]
	})
	orders!: StockOrderResponse[];

	@ApiProperty({
		type: StockDataResponse
	})
	stockData!: StockDataResponse;
}

export class RealEstateAssetResponse { 
	@ApiProperty({
		type: "string"
	})
	address!: string;
}

export class AssetResponse { 
	@ApiProperty({
		type: StockAssetResponse,
		nullable: true
	})
	stockAsset?: StockAssetResponse;

	@ApiProperty({
		type: RealEstateAssetResponse,
		nullable: true
	})
	realEstateAsset?: RealEstateAssetResponse;

	static map(asset: Asset): AssetResponse {
		if (asset.stockAsset === undefined) { 
			return {
				realEstateAsset: {
					address: asset.realEstateAsset?.address ?? ""
				}
			}
		}

		return {
			stockAsset: {
				stockData: StockDataResponse.map(asset.stockAsset.stockData!),
				orders: (asset.stockAsset.orders ?? []).map(order => StockOrderResponse.map(order))
			}
		}
	}
}

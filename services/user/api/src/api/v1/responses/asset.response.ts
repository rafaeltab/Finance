import { ApiProperty } from "@nestjs/swagger";
import type { Asset, StockOrder } from "@finance/svc-user-domain";
import { UnexpectedError } from "@finance/lib-errors";
import { StockDataResponse } from "./stockData.response";
import { EntityResponse } from "./identity.response";

export class StockOrderResponse { 
	@ApiProperty({
		type: "number"
	})
	amount?: number;

	@ApiProperty({
		type: "number"
	})
	usdPrice?: number;

	static map(order: StockOrder): StockOrderResponse {
		return {
			amount: order.amount ?? 0,
			usdPrice: order.usdPrice ?? 0
		}
	}
}

export class StockAssetResponse extends EntityResponse { 
	@ApiProperty({
		type: [StockOrderResponse]
	})
	orders!: StockOrderResponse[];

	@ApiProperty({
		type: StockDataResponse
	})
	stockData!: StockDataResponse;
}

export class RealEstateAssetResponse extends EntityResponse { 
	@ApiProperty({
		type: "string"
	})
	address!: string;
}

export class AssetResponse extends EntityResponse { 
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
		if (asset.stockAsset === undefined || asset.stockAsset === null) { 
			return {
				realEstateAsset: {
					address: asset.realEstateAsset?.address ?? "",
					identity: asset.realEstateAsset?.identity ?? ""
				},
				identity: asset.identity ?? ""
			}
		}

		if (asset.stockAsset.stockData === undefined) { 
			throw new UnexpectedError("Stock data was empty on stock asset");
		}

		return {
			stockAsset: {
				stockData: StockDataResponse.map(asset.stockAsset.stockData),
				orders: (asset.stockAsset.orders ?? []).map(StockOrderResponse.map),
				identity: asset.stockAsset.identity
			},
			identity: asset.identity ?? "",
		}
	}
}

import { ApiProperty } from "@nestjs/swagger";
import { PaginatedResponse, PaginatedResponseData } from "../responses/paginated.response";
import { StockDataResponse, StockValueResponse } from "../responses/stockData.response";
import { SuccessResponse, SuccessResponseData } from "../responses/success.response";

import type { ResponseType as StockDataSearchQueryResponse } from "@finance/application/build/queries/stockDataSearchQuery";
import type { ResponseType as StockDataViewQueryResponse } from "@finance/application/build/queries/stockDataViewQuery";

class GetSearchStockPaginatedResponse extends PaginatedResponse implements PaginatedResponseData<StockDataResponse> {
	@ApiProperty({
		type: [StockDataResponse]
	})
	data!: StockDataResponse[];

	@ApiProperty({
		type: "boolean"
	})
	isEmpty!: boolean;
}

export class GetSearchStockResponse extends SuccessResponse implements SuccessResponseData<GetSearchStockPaginatedResponse> {
	@ApiProperty({
		type: GetSearchStockPaginatedResponse
	})
	data!: GetSearchStockPaginatedResponse

	static map(response: StockDataSearchQueryResponse): GetSearchStockResponse {
		return {
			data: {
				data: response.data.data.map(StockDataResponse.map),
				isEmpty: response.data.isEmpty,
				page: {
					count: response.data.page.count,
					offset: response.data.page.offset,
					total: response.data.page.total
				}
			},
			success: response.success
		}
	}
}

export class GetStockListResponse extends GetSearchStockResponse {
	
}

class StockValuePaginatedResponse extends PaginatedResponse implements PaginatedResponseData<StockValueResponse> {
	@ApiProperty({
		type: [StockValueResponse]
	})
	data!: StockValueResponse[];
}

class StockDataViewResponseData { 
	@ApiProperty({
		type: StockDataResponse
	})
	stockData!: StockDataResponse;

	@ApiProperty({
		type: StockValuePaginatedResponse
	})
	yearlyValues!: StockValuePaginatedResponse;

	@ApiProperty({
		type: "boolean"
	})
	hasValues!: boolean;
}

export class StockDataViewResponse extends SuccessResponse implements SuccessResponseData<StockDataViewResponseData> {
	@ApiProperty({
		type: StockDataViewResponseData
	})
	data!: StockDataViewResponseData;

	static map(response: StockDataViewQueryResponse): StockDataViewResponse {
		return {
			data: {
				stockData: StockDataResponse.map(response.data.stockData),
				yearlyValues: {
					data: response.data.yearlyValues.data.map(StockValueResponse.map),
					page: {
						count: response.data.yearlyValues.page.count,
						offset: response.data.yearlyValues.page.offset,
						total: response.data.yearlyValues.page.total
					}
				},
				hasValues: response.data.hasValues
			},
			success: response.success
		}
	}
}
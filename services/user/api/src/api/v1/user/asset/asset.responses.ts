import type { ResponseType as CreateAssetGroupForUserCommandResponse } from "@finance/svc-user-application/build/commands/assets/createAssetGroupForUserCommand";
import type { ResponseType as CreateRealEstateAssetForUserCommandResponse } from "@finance/svc-user-application/build/commands/assets/createRealEstateAssetForUserCommand";
import type { ResponseType as CreateStockAssetForUserCommandResponse } from "@finance/svc-user-application/build/commands/assets/createStockAssetForUserCommand";
import type { ResponseType as GetAssetGroupQueryResponse } from "@finance/svc-user-application/build/queries/assets/getAssetGroupQuery";
import type { ResponseType as GetAssetGroupsForUserQueryResponse } from "@finance/svc-user-application/build/queries/assets/getAssetGroupsForUserQuery";
import type { ResponseType as GetAssetQueryResponse } from "@finance/svc-user-application/build/queries/assets/getAssetQuery";
import type { ResponseType as GetAssetsForUserQueryResponse } from "@finance/svc-user-application/build/queries/assets/getAssetsForUserQuery";
import type { AssetGroup } from "@finance/svc-user-domain";
import { ApiProperty } from "@nestjs/swagger";
import { AssetResponse } from "../../responses/asset.response";
import { AssetGroupResponse } from "../../responses/assetGroup.response";
import { PaginatedResponse, PaginatedResponseData } from "../../responses/paginated.response";
import { SuccessResponse, SuccessResponseData } from "../../responses/success.response";

export class GetAssetResponse extends SuccessResponse implements SuccessResponseData<AssetResponse>{
	@ApiProperty({
		type: AssetResponse
	})
	data!: AssetResponse;

	static map(asset: GetAssetQueryResponse): GetAssetResponse  { 
		return {
			success: asset.success,
			data: AssetResponse.map(asset.data)
		}
	}
}


class PaginatedAssetResponse extends PaginatedResponse implements PaginatedResponseData<AssetResponse> {
	@ApiProperty({
		type: [AssetResponse],
	})
	data!: AssetResponse[];
}
class PaginatedAssetGroupResponse extends PaginatedResponse implements PaginatedResponseData<AssetGroupResponse> {
	@ApiProperty({
		type: [AssetGroupResponse],
	})
	data!: AssetGroupResponse[];
}

class GetAssetGroupResponseData { 
	@ApiProperty({
		type: AssetGroupResponse
	})
	group!: AssetGroupResponse;
	
	@ApiProperty({
		type: [PaginatedAssetResponse]
	})
	assets!: PaginatedAssetResponse;

	static map(group: AssetGroup, assets: GetAssetGroupQueryResponse["data"]["assets"]): GetAssetGroupResponseData { 
		return {
			group: AssetGroupResponse.map(group),
			assets: {
				data: assets.data.map(AssetResponse.map),
				page: {
					count: assets.page.count,
					offset: assets.page.offset,
					total: assets.page.total
				}
			}
		}
	}
}

export class GetAssetGroupResponse extends SuccessResponse implements SuccessResponseData<GetAssetGroupResponseData>{
	@ApiProperty({
		type: GetAssetGroupResponseData
	})
	data!: GetAssetGroupResponseData;

	static map(asset: GetAssetGroupQueryResponse): GetAssetGroupResponse {
		return {
			data: GetAssetGroupResponseData.map(asset.data.group, asset.data.assets),
			success: asset.success
		}
	}
}

export class GetUserAssetsResponse extends SuccessResponse implements SuccessResponseData<PaginatedAssetResponse> {
	@ApiProperty({
		type: PaginatedAssetResponse
	})
	data!: PaginatedAssetResponse;

	static map(assets: GetAssetsForUserQueryResponse): GetUserAssetsResponse {
		return {
			success: true,
			data: {
				page: {
					count: assets.data.page.count,
					offset: assets.data.page.offset,
					total: assets.data.page.total
				},
				data: assets.data.data.map(AssetResponse.map)
			}
		}
	}
}

export class GetUserAssetGroupsResponse extends SuccessResponse implements SuccessResponseData<PaginatedAssetGroupResponse> { 
	@ApiProperty({
		type: PaginatedAssetGroupResponse
	})
	data!: PaginatedAssetGroupResponse;

	static map(groups: GetAssetGroupsForUserQueryResponse): GetUserAssetGroupsResponse {
		return {
			success: true,
			data: {
				page: {
					count: groups.data.page.count,
					offset: groups.data.page.offset,
					total: groups.data.page.total
				},
				data: groups.data.data.map(AssetGroupResponse.map)
			}
		}
	}
}

export class CreateStockAssetForUserResponse extends SuccessResponse implements SuccessResponseData<AssetResponse> {
	@ApiProperty({
		type: AssetResponse
	})
	data!: AssetResponse;

	static map(asset: CreateStockAssetForUserCommandResponse): CreateStockAssetForUserResponse {
		return {
			success: true,
			data: AssetResponse.map(asset.data.asset)
		}
	}
}

export class CreateRealEstateAssetForUserResponse extends SuccessResponse implements SuccessResponseData<AssetResponse> {
	@ApiProperty({
		type: AssetResponse
	})
	data!: AssetResponse;

	static map(asset: CreateRealEstateAssetForUserCommandResponse): CreateStockAssetForUserResponse {
		return {
			success: true,
			data: AssetResponse.map(asset.data.asset)
		}
	}
}

export class CreateAssetGroupForUserResponse extends SuccessResponse implements SuccessResponseData<AssetGroupResponse> { 
	@ApiProperty({
		type: AssetGroupResponse
	})
	data!: AssetGroupResponse;

	static map(group: CreateAssetGroupForUserCommandResponse): CreateAssetGroupForUserResponse { 
		return {
			success: true,
			data: AssetGroupResponse.map(group.data)
		}
	}
}

export class CreateStockAssetForAssetGroupResponse extends CreateStockAssetForUserResponse {
}

export class CreateRealEstateAssetForGroup extends CreateRealEstateAssetForUserResponse {
}
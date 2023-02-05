import { CreateAssetGroupForUserCommand, CreateRealEstateAssetForAssetGroupCommand, CreateRealEstateAssetForUserCommand, CreateStockAssetForAssetGroupCommand, CreateStockAssetForUserCommand, DeleteAssetCommand, DeleteAssetGroupCommand, GetAssetGroupQuery, GetAssetGroupsForUserQuery, GetAssetQuery, GetAssetsForUserQuery } from "@finance/application";
import { DuplicateEntryError, EntryNotFoundError } from "@finance/errors";
import { FinanceErrors } from "@finance/errors-nest";
import { Mediator } from "@finance/libs-types";
import { Body, Controller, Delete, Get, Inject, Param, Put } from "@nestjs/common";
import { UserIdentityParam, UserIdentityParams } from "../userIdentity.params";
import { AssetGroupIdentityParam, AssetGroupIdentityParams } from "./assetGroupIdentity.params";
import { AssetIdentityParam, AssetIdentityParams } from "./assetIdentity.params";
import { CreateRealEstateAssetBody } from "./createRealEstateAsset.body";
import { CreateStockAssetBody } from "./createStockAsset.body";
import type { CreateAssetGroupBody } from "./createAssetGroup.body";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { CreateAssetGroupForUserResponse, CreateRealEstateAssetForGroup, CreateRealEstateAssetForUserResponse, CreateStockAssetForAssetGroupResponse, CreateStockAssetForUserResponse, GetAssetGroupResponse, GetAssetResponse, GetUserAssetGroupsResponse, GetUserAssetsResponse } from "./asset.responses";
import { SuccessResponse } from "../../responses/success.response";

@Controller("/api/v1")
export class AssetController {
	constructor(@Inject(Mediator) private mediator: Mediator) { }

	// GET /api/v1/asset/:assetIdentity -> Single asset
	@Get("/asset/:assetIdentity")
	@FinanceErrors([EntryNotFoundError])
	@ApiBearerAuth("oauth2")
	@AssetIdentityParam()
	@ApiOkResponse({
		type: GetAssetResponse
	})
	async getAsset(
		@Param() params: AssetIdentityParams
	): Promise<GetAssetResponse> {
		return GetAssetResponse.map(await this.mediator.query(new GetAssetQuery({
			assetIdentity: params.assetIdentity
		})));
	}

	// GET /api/v1/assetGroup/:assetGroupIdentity -> Get a group with all assets
	@Get("/assetGroup/:assetGroupIdentity")
	@FinanceErrors([EntryNotFoundError])
	@ApiBearerAuth("oauth2")
	@AssetGroupIdentityParam()
	@ApiOkResponse({
		type: GetAssetGroupResponse
	})
	async getAssetGroup(
		@Param() params: AssetGroupIdentityParams
	): Promise<GetAssetGroupResponse> {
		return GetAssetGroupResponse.map(await this.mediator.query(new GetAssetGroupQuery({
			assetGroupIdentity: params.assetGroupIdentity,
			limit: 30,
			offset: 0
		})));
	}

	// GET /api/v1/user/:userIdentity/asset -> All assets for user
	@Get("/user/:userIdentity/asset")
	@FinanceErrors([EntryNotFoundError])
	@ApiBearerAuth("oauth2")
	@UserIdentityParam()
	@ApiOkResponse({
		type: GetUserAssetsResponse,
	})
	async getUserAssets(
		@Param() params: UserIdentityParams
	): Promise<GetUserAssetsResponse> {
		return GetUserAssetsResponse.map(await this.mediator.query(new GetAssetsForUserQuery({
			userIdentity: params.userIdentity,
			limit: 30,
			offset: 0
		})));
	}

	// GET /api/v1/user/:userIdentity/assetGroup -> All asset groups for user

	@Get("/user/:userIdentity/assetGroup")
	@FinanceErrors([EntryNotFoundError])
	@ApiBearerAuth("oauth2")
	@UserIdentityParam()
	@ApiOkResponse({
		type: GetUserAssetGroupsResponse,
	})
	async getUserAssetGroups(
		@Param() params: UserIdentityParams
	): Promise<GetUserAssetGroupsResponse> {
		return GetUserAssetGroupsResponse.map(await this.mediator.query(new GetAssetGroupsForUserQuery({
			userIdentity: params.userIdentity,
			limit: 30,
			offset: 0
		})));
	}

	// PUT /api/v1/user/:userIdentity/asset/stock -> Create a stcck asset for user
	@Put("/user/:userIdentity/asset/stock")
	@FinanceErrors([EntryNotFoundError, DuplicateEntryError])
	@ApiBearerAuth("oauth2")
	@UserIdentityParam()
	@ApiOkResponse({
		type: CreateStockAssetForUserResponse,
	})
	async createStockAssetForUser(
		@Param() params: UserIdentityParams,
		@Body() body: CreateStockAssetBody
	): Promise<CreateStockAssetForUserResponse> {
		return CreateStockAssetForUserResponse.map(await this.mediator.query(new CreateStockAssetForUserCommand({
			userIdentity: params.userIdentity,
			stockDataIdentity: body.stockDataIdentity,
			stockOrders: body.stockOrders
		})))
	}

	// PUT /api/v1/user/:userIdentity/asset/realEstate -> Create a real estate asset for user
	@Put("/user/:userIdentity/asset/realEstate")
	@FinanceErrors([EntryNotFoundError, DuplicateEntryError])
	@ApiBearerAuth("oauth2")
	@UserIdentityParam()
	@ApiOkResponse({
		type: CreateRealEstateAssetForUserResponse
	})
	async createRealEstateAssetForUser(
		@Param() params: UserIdentityParams,
		@Body() body: CreateRealEstateAssetBody
	): Promise<CreateRealEstateAssetForUserResponse> {
		return CreateRealEstateAssetForUserResponse.map(await this.mediator.query(new CreateRealEstateAssetForUserCommand({
			userIdentity: params.userIdentity,
			address: body.address,
		})));
	}

	// PUT /api/v1/user/:userIdentity/assetGroup -> Create asset group for user
	@Put("/user/:userIdentity/assetGroup")
	@FinanceErrors([EntryNotFoundError, DuplicateEntryError])
	@ApiBearerAuth("oauth2")
	@UserIdentityParam()
	@ApiOkResponse({
		type: CreateAssetGroupForUserResponse
	})
	async createAssetGroupForUser(
		@Param() params: UserIdentityParams,
		@Body() body: CreateAssetGroupBody
	): Promise<CreateAssetGroupForUserResponse> {
		return CreateAssetGroupForUserResponse.map(await this.mediator.command(new CreateAssetGroupForUserCommand({
			name: body.name,
			userIdentity: params.userIdentity
		})));
	}

	// PUT /api/v1/user/:userIdentity/assetGroup/:assetGroupIdentity/asset/stock -> Create stock asset for group
	@Put("/assetGroup/:assetGroupIdentity/asset/stock")
	@FinanceErrors([EntryNotFoundError, DuplicateEntryError])
	@ApiBearerAuth("oauth2")
	@AssetGroupIdentityParam()
	@ApiOkResponse({
		type: CreateStockAssetForAssetGroupResponse
	})
	async createStockAssetForGroup(
		@Param() params: AssetGroupIdentityParams,
		@Body() body: CreateStockAssetBody
	): Promise<CreateStockAssetForAssetGroupResponse> {
		return CreateStockAssetForAssetGroupResponse.map(await this.mediator.query(new CreateStockAssetForAssetGroupCommand({
			assetGroupIdentity: params.assetGroupIdentity,
			stockDataIdentity: body.stockDataIdentity,
			stockOrders: body.stockOrders
		})));
	}

	// PUT /api/v1/user/:userIdentity/assetGroup/:assetGroupIdentity/asset/realEstate -> Create real estate asset for group
	@Put("/assetGroup/:assetGroupIdentity/asset/realEstate")
	@FinanceErrors([EntryNotFoundError, DuplicateEntryError])
	@ApiBearerAuth("oauth2")
	@AssetGroupIdentityParam()
	@ApiOkResponse({
		type: CreateRealEstateAssetForGroup
	})
	async createRealEstateAssetForGroup(
		@Param() params: AssetGroupIdentityParams,
		@Body() body: CreateRealEstateAssetBody
	): Promise<CreateRealEstateAssetForGroup> {
		return CreateRealEstateAssetForGroup.map(await this.mediator.query(new CreateRealEstateAssetForAssetGroupCommand({
			assetGroupIdentity: params.assetGroupIdentity,
			address: body.address,
		})));
	}

	// DELETE /api/v1/asset/:assetIdentity
	@Delete("/asset/:assetIdentity")
	@FinanceErrors([EntryNotFoundError])
	@ApiBearerAuth("oauth2")
	@AssetIdentityParam()
	@ApiOkResponse({
		type: SuccessResponse
	})
	async deleteAsset(
		@Param() params: AssetIdentityParams
	): Promise<SuccessResponse> {
		return await this.mediator.query(new DeleteAssetCommand({
			assetIdentity: params.assetIdentity
		}));
	}

	// DELETE /api/v1/assetGroup/:assetGroupIdentity
	@Delete("/assetGroup/:assetGroupIdentity")
	@FinanceErrors([EntryNotFoundError])
	@ApiBearerAuth("oauth2")
	@AssetGroupIdentityParam()
	@ApiOkResponse({
		type: SuccessResponse
	})
	async deleteAssetGroup(
		@Param() params: AssetGroupIdentityParams
	): Promise<SuccessResponse> {
		return await this.mediator.query(new DeleteAssetGroupCommand({
			assetGroupIdentity: params.assetGroupIdentity
		}))
	}
}

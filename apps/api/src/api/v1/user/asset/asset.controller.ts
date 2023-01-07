import { Mediator } from "@finance/libs-types";
import { Body, Controller, Delete, Get, HttpException, Inject, Param, Put } from "@nestjs/common";
import { AssetIdentityParams } from "./assetIdentity.params";
import { GetAssetGroupsForUserQuery, GetAssetQuery, GetAssetGroupQuery, GetAssetsForUserQuery, CreateStockAssetForUserCommand, CreateRealEstateAssetForUserCommand, CreateStockAssetForAssetGroupCommand, CreateRealEstateAssetForAssetGroupCommand, DeleteAssetCommand, DeleteAssetGroupCommand } from "@finance/application";
import { UserIdentityParams } from "../userIdentity.params";
import { AssetGroupIdentityParams } from "./assetGroupIdentity.params";
import { CreateStockAssetBody } from "./createStockAsset.body";
import { CreateRealEstateAssetBody } from "./createRealEstateAsset.body";

@Controller("/api/v1")
export class AssetController {
	constructor(@Inject(Mediator) private mediator: Mediator) { }

	
	
	// GET /api/v1/asset/:assetIdentity -> Single asset
	@Get("/asset/:assetIdentity")
	async getAsset(
		@Param() params: AssetIdentityParams
	) {
		var queryResult = await this.mediator.query(new GetAssetQuery({
			assetIdentity: params.assetIdentity
		}))

		if (queryResult.success) {
			return queryResult;
		}

		throw new HttpException(queryResult.message, queryResult.httpCode ?? 500);
	}
	
	// GET /api/v1/assetGroup/:assetGroupIdentity -> Get a group with all assets
	@Get("/assetGroup/:assetGroupIdentity")
	async getAssetGroup(
		@Param() params: AssetGroupIdentityParams
	) {
		var queryResult = await this.mediator.query(new GetAssetGroupQuery({
			assetGroupIdentity: params.assetGroupIdentity,
			limit: 30,
			offset: 0
		}))

		if (queryResult.success) {
			return queryResult;
		}

		throw new HttpException(queryResult.message, queryResult.httpCode ?? 500);
	}
	
	// GET /api/v1/user/:userIdentity/asset -> All assets for user
	@Get("/user/:userIdentity/asset")
	async getUserAssets(
		@Param() params: UserIdentityParams
	) {
		var queryResult = await this.mediator.query(new GetAssetsForUserQuery({
			userIdentity: params.userIdentity,
			limit: 30,
			offset: 0
		}))

		if (queryResult.success) {
			return queryResult;
		}

		throw new HttpException(queryResult.message, queryResult.httpCode ?? 500);
	}

	// GET /api/v1/user/:userIdentity/assetGroup -> All asset groups for user
	
	@Get("/user/:userIdentity/assetGroup")
	async getUserAssetGroups(
		@Param() params: UserIdentityParams
	) {
		var queryResult = await this.mediator.query(new GetAssetGroupsForUserQuery({
			userIdentity: params.userIdentity,
			limit: 30,
			offset: 0
		}))

		if (queryResult.success) {
			return queryResult;
		}

		throw new HttpException(queryResult.message, queryResult.httpCode ?? 500);
	}
	
	
	// PUT /api/v1/user/:userIdentity/asset/stock -> Create a stcck asset for user
	@Put("/user/:userIdentity/asset/stock")
	async createStockAssetForUser(
		@Param() params: UserIdentityParams,
		@Body() body: CreateStockAssetBody
	) {
		var commandResult = await this.mediator.query(new CreateStockAssetForUserCommand({
			userIdentity: params.userIdentity,
			stockDataIdentity: body.stockDataIdentity,
			stockOrders: body.stockOrders
		}))

		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}
	
	// PUT /api/v1/user/:userIdentity/asset/realEstate -> Create a real estate asset for user
	@Put("/user/:userIdentity/asset/realEstate")
	async createRealEstateAssetForUser(
		@Param() params: UserIdentityParams,
		@Body() body: CreateRealEstateAssetBody
	) {
		var commandResult = await this.mediator.query(new CreateRealEstateAssetForUserCommand({
			userIdentity: params.userIdentity,
			address: body.address,
		}))

		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}
	
	// PUT /api/v1/user/:userIdentity/assetGroup -> Create asset group for user
	@Put("/user/:userIdentity/assetGroup")
	createAssetGroupForUser() {
		
	}
	
	// PUT /api/v1/user/:userIdentity/assetGroup/:assetGroupIdentity/asset/stock -> Create stock asset for group
	@Put("/assetGroup/:assetGroupIdentity/asset/stock")
	async createStockAssetForGroup(
		@Param() params: AssetGroupIdentityParams,
		@Body() body: CreateStockAssetBody
	) {
		var commandResult = await this.mediator.query(new CreateStockAssetForAssetGroupCommand({
			assetGroupIdentity: params.assetGroupIdentity,
			stockDataIdentity: body.stockDataIdentity,
			stockOrders: body.stockOrders
		}))

		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}
	
	// PUT /api/v1/user/:userIdentity/assetGroup/:assetGroupIdentity/asset/realEstate -> Create real estate asset for group
	@Put("/assetGroup/:assetGroupIdentity/asset/realEstate")
	async createRealEstateAssetForGroup(
		@Param() params: AssetGroupIdentityParams,
		@Body() body: CreateRealEstateAssetBody
	) {
		var commandResult = await this.mediator.query(new CreateRealEstateAssetForAssetGroupCommand({
			assetGroupIdentity: params.assetGroupIdentity,
			address: body.address,
		}))

		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}
	
	// DELETE /api/v1/asset/:assetIdentity
	@Delete("/asset/:assetIdentity")
	async deleteAsset(
		@Param() params: AssetIdentityParams
	) {
		var commandResult = await this.mediator.query(new DeleteAssetCommand({
			assetIdentity: params.assetIdentity
		}))

		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}
	
	// DELETE /api/v1/assetGroup/:assetGroupIdentity
	@Delete("/assetGroup/:assetGroupIdentity")
	async deleteAssetGroup(
		@Param() params: AssetGroupIdentityParams
	) {
		var commandResult = await this.mediator.query(new DeleteAssetGroupCommand({
			assetGroupIdentity: params.assetGroupIdentity
		}))

		if (commandResult.success) {
			return commandResult;
		}

		throw new HttpException(commandResult.message, commandResult.httpCode ?? 500);
	}
}

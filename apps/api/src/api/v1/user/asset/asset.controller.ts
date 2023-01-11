import { CreateAssetGroupForUserCommand, CreateRealEstateAssetForAssetGroupCommand, CreateRealEstateAssetForUserCommand, CreateStockAssetForAssetGroupCommand, CreateStockAssetForUserCommand, DeleteAssetCommand, DeleteAssetGroupCommand, GetAssetGroupQuery, GetAssetGroupsForUserQuery, GetAssetQuery, GetAssetsForUserQuery } from "@finance/application";
import { DuplicateEntryError, EntryNotFoundError } from "@finance/errors";
import { FinanceErrors } from "@finance/errors-nest";
import { Mediator } from "@finance/libs-types";
import { Body, Controller, Delete, Get, Inject, Param, Put } from "@nestjs/common";
import { UserIdentityParams } from "../userIdentity.params";
import { AssetGroupIdentityParams } from "./assetGroupIdentity.params";
import { AssetIdentityParams } from "./assetIdentity.params";
import { CreateRealEstateAssetBody } from "./createRealEstateAsset.body";
import { CreateStockAssetBody } from "./createStockAsset.body";
import type { CreateAssetGroupBody } from "./createAssetGroup.body";

@Controller("/api/v1")
export class AssetController {
	constructor(@Inject(Mediator) private mediator: Mediator) { }

	// GET /api/v1/asset/:assetIdentity -> Single asset
	@Get("/asset/:assetIdentity")
	@FinanceErrors([EntryNotFoundError])
	async getAsset(
		@Param() params: AssetIdentityParams
	) {
		return await this.mediator.query(new GetAssetQuery({
			assetIdentity: params.assetIdentity
		}))
	}

	// GET /api/v1/assetGroup/:assetGroupIdentity -> Get a group with all assets
	@Get("/assetGroup/:assetGroupIdentity")
	@FinanceErrors([EntryNotFoundError])
	async getAssetGroup(
		@Param() params: AssetGroupIdentityParams
	) {
		return await this.mediator.query(new GetAssetGroupQuery({
			assetGroupIdentity: params.assetGroupIdentity,
			limit: 30,
			offset: 0
		}))
	}

	// GET /api/v1/user/:userIdentity/asset -> All assets for user
	@Get("/user/:userIdentity/asset")
	@FinanceErrors([EntryNotFoundError])
	async getUserAssets(
		@Param() params: UserIdentityParams
	) {
		return await this.mediator.query(new GetAssetsForUserQuery({
			userIdentity: params.userIdentity,
			limit: 30,
			offset: 0
		}))
	}

	// GET /api/v1/user/:userIdentity/assetGroup -> All asset groups for user

	@Get("/user/:userIdentity/assetGroup")
	@FinanceErrors([EntryNotFoundError])
	async getUserAssetGroups(
		@Param() params: UserIdentityParams
	) {
		return await this.mediator.query(new GetAssetGroupsForUserQuery({
			userIdentity: params.userIdentity,
			limit: 30,
			offset: 0
		}));
	}

	// PUT /api/v1/user/:userIdentity/asset/stock -> Create a stcck asset for user
	@Put("/user/:userIdentity/asset/stock")
	@FinanceErrors([EntryNotFoundError, DuplicateEntryError])
	async createStockAssetForUser(
		@Param() params: UserIdentityParams,
		@Body() body: CreateStockAssetBody
	) {
		return await this.mediator.query(new CreateStockAssetForUserCommand({
			userIdentity: params.userIdentity,
			stockDataIdentity: body.stockDataIdentity,
			stockOrders: body.stockOrders
		}))
	}

	// PUT /api/v1/user/:userIdentity/asset/realEstate -> Create a real estate asset for user
	@Put("/user/:userIdentity/asset/realEstate")
	@FinanceErrors([EntryNotFoundError, DuplicateEntryError])
	async createRealEstateAssetForUser(
		@Param() params: UserIdentityParams,
		@Body() body: CreateRealEstateAssetBody
	) {
		return await this.mediator.query(new CreateRealEstateAssetForUserCommand({
			userIdentity: params.userIdentity,
			address: body.address,
		}))
	}

	// PUT /api/v1/user/:userIdentity/assetGroup -> Create asset group for user
	@Put("/user/:userIdentity/assetGroup")
	@FinanceErrors([EntryNotFoundError, DuplicateEntryError])
	async createAssetGroupForUser(
		@Param() params: UserIdentityParams,
		@Body() body: CreateAssetGroupBody
	) {
		return await this.mediator.command(new CreateAssetGroupForUserCommand({
			name: body.name,
			userIdentity: params.userIdentity
		}))
	}

	// PUT /api/v1/user/:userIdentity/assetGroup/:assetGroupIdentity/asset/stock -> Create stock asset for group
	@Put("/assetGroup/:assetGroupIdentity/asset/stock")
	@FinanceErrors([EntryNotFoundError, DuplicateEntryError])
	async createStockAssetForGroup(
		@Param() params: AssetGroupIdentityParams,
		@Body() body: CreateStockAssetBody
	) {
		return await this.mediator.query(new CreateStockAssetForAssetGroupCommand({
			assetGroupIdentity: params.assetGroupIdentity,
			stockDataIdentity: body.stockDataIdentity,
			stockOrders: body.stockOrders
		}))
	}

	// PUT /api/v1/user/:userIdentity/assetGroup/:assetGroupIdentity/asset/realEstate -> Create real estate asset for group
	@Put("/assetGroup/:assetGroupIdentity/asset/realEstate")
	@FinanceErrors([EntryNotFoundError, DuplicateEntryError])
	async createRealEstateAssetForGroup(
		@Param() params: AssetGroupIdentityParams,
		@Body() body: CreateRealEstateAssetBody
	) {
		return await this.mediator.query(new CreateRealEstateAssetForAssetGroupCommand({
			assetGroupIdentity: params.assetGroupIdentity,
			address: body.address,
		}))
	}

	// DELETE /api/v1/asset/:assetIdentity
	@Delete("/asset/:assetIdentity")
	@FinanceErrors([EntryNotFoundError])
	async deleteAsset(
		@Param() params: AssetIdentityParams
	) {
		await this.mediator.query(new DeleteAssetCommand({
			assetIdentity: params.assetIdentity
		}))
	}

	// DELETE /api/v1/assetGroup/:assetGroupIdentity
	@Delete("/assetGroup/:assetGroupIdentity")
	@FinanceErrors([EntryNotFoundError])
	async deleteAssetGroup(
		@Param() params: AssetGroupIdentityParams
	) {
		return await this.mediator.query(new DeleteAssetGroupCommand({
			assetGroupIdentity: params.assetGroupIdentity
		}))
	}
}

import { inject, injectable } from "tsyringe";
import { UnitOfWork, unitOfWork } from "../unitOfWork/unitOfWork";
import { Asset, AssetGroup, EntityKey, IAssetFactory, RealEstateAsset, StockAsset, User, StockOrder, StockData } from "@finance/domain";

@injectable()
export class AssetFactory implements IAssetFactory {

	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }

	async addStockOrderToStockAsset(asset: EntityKey, amount: number, price: number): Promise<StockAsset> {
		const assetEntity = await this._unitOfWork.getQueryRunner().manager.findOne(Asset, {
			where: asset,
			relations: {
				stockAsset: true,
			}
		});

		if (assetEntity === null) {
			throw new Error("Asset not found");
		}

		if (assetEntity.stockAsset === null || assetEntity.stockAsset === undefined) {
			throw new Error("Asset is not a stock asset");
		}


		if (assetEntity.stockAsset.orders === undefined) {
			throw new Error("Orders not loaded");
		}

		assetEntity.stockAsset.orders.push(new StockOrder({
			amount,
			usdPrice: price,
		}))

		await this._unitOfWork.getQueryRunner().manager.save([assetEntity.stockAsset]);

		return assetEntity.stockAsset;
	}

	async addStockToAssetGroup(assetGroup: EntityKey, stockDataId: EntityKey, stockOrders: { amount: number, price: number }[]): Promise<[StockAsset, Asset]> {
		const assetGroupEntity = await this._unitOfWork.getQueryRunner().manager.findOne(AssetGroup, {
			where: assetGroup,
			relations: {
				assets: true,
			}
		});

		if (!assetGroupEntity) {
			throw new Error("Asset group not found");
		}

		const [stockAssetEntity, assetEntity, stockOrderEntities] = await this.createStockAsset({
			kind: "group",
			entity: assetGroupEntity
		}, stockDataId, stockOrders);

		await this._unitOfWork.getQueryRunner().manager.save([assetEntity, assetGroupEntity, ...stockOrderEntities]);

		return [stockAssetEntity, assetEntity];
	}
	async addRealEstateToAssetGroup(assetGroup: EntityKey, address: string): Promise<[RealEstateAsset, Asset]> {
		const assetGroupEntity = await this._unitOfWork.getQueryRunner().manager.findOne(AssetGroup, {
			where: assetGroup,
			relations: {
				assets: true,
			}
		});

		if (!assetGroupEntity) {
			throw new Error("Asset group not found");
		}

		const [realEstateAsset, assetEntity] = await this.createRealEstateAsset({
			kind: "group",
			entity: assetGroupEntity
		}, address);

		await this._unitOfWork.getQueryRunner().manager.save([assetEntity, assetGroupEntity]);

		return [realEstateAsset, assetEntity];
	}
	async addStockToUser(user: EntityKey, stockDataId: EntityKey, stockOrders: { amount: number, price: number }[]): Promise<[StockAsset, Asset]> {
		const userEntity = await this._unitOfWork.getQueryRunner().manager.findOne(User, {
			where: user,
			relations: {
				assets: true,
			}
		});

		if (!userEntity) {
			throw new Error("User not found");
		}

		const [stockAssetEntity, assetEntity, stockOrderEntities] = await this.createStockAsset({
			kind: "user",
			entity: userEntity
		}, stockDataId, stockOrders);

		await this._unitOfWork.getQueryRunner().manager.save([assetEntity, userEntity, ...stockOrderEntities]);

		return [stockAssetEntity, assetEntity];
	}
	async addRealEstateToUser(user: EntityKey, address: string): Promise<[RealEstateAsset, Asset]> {
		const userEntity = await this._unitOfWork.getQueryRunner().manager.findOne(User, {
			where: user,
			relations: {
				assets: true,
			}
		});

		if (!userEntity) {
			throw new Error("User not found");
		}

		const [realEstateAsset, assetEntity] = await this.createRealEstateAsset({
			kind: "user",
			entity: userEntity
		}, address);

		await this._unitOfWork.getQueryRunner().manager.save([assetEntity, realEstateAsset]);

		return [realEstateAsset, assetEntity];
	}

	private async createStockAsset(ownerEntity: { kind: "user", entity: User } | { kind: "group", entity: AssetGroup }, stockDataId: EntityKey, stockOrders: { amount: number, price: number }[]) {
		const stockData = await this._unitOfWork.getQueryRunner().manager.findOne(StockData, {
			where: stockDataId,
		});

		if (!stockData) {
			throw new Error("Stock data not found");
		}

		const identities = this.createStockAssetIdentity(ownerEntity.entity.identity, stockData)

		const stockAssetEntity = new StockAsset({
			stockData: stockData,
			identity: identities[0],
		});

		const assetEntity = new Asset({
			identity: identities[1],
			stockAsset: stockAssetEntity,
		});

		const orders: StockOrder[] = [];

		for (const stockOrder of stockOrders) {
			orders.push(new StockOrder({
				amount: stockOrder.amount,
				usdPrice: stockOrder.price
			}));
		}

		stockAssetEntity.orders = orders;

		if (ownerEntity.kind === "group") {
			assetEntity[ownerEntity.kind] = ownerEntity.entity;
		} else {
			assetEntity[ownerEntity.kind] = ownerEntity.entity;
		}
		if (ownerEntity.entity.assets === undefined) {
			throw new Error("Assets not loaded");
		}

		ownerEntity.entity.assets.push(assetEntity);

		return [stockAssetEntity, assetEntity, stockAssetEntity.orders] as [StockAsset, Asset, StockOrder[]];
	}

	private async createRealEstateAsset(ownerEntity: { kind: "user", entity: User } | { kind: "group", entity: AssetGroup }, address: string) {
		const identities = this.createRealEstateAssetIdentity(ownerEntity.entity.identity, address)

		const realEstateAsset = new RealEstateAsset({
			address: address,
			identity: identities[0],
		});
		const assetEntity = new Asset({
			identity: identities[1],
			realEstateAsset: realEstateAsset,
		});

		if (ownerEntity.kind === "group") {
			assetEntity[ownerEntity.kind] = ownerEntity.entity;
		} else {
			assetEntity[ownerEntity.kind] = ownerEntity.entity;
		}
		if (ownerEntity.entity.assets === undefined) {
			throw new Error("Assets not loaded");
		}

		ownerEntity.entity.assets.push(assetEntity);

		return [realEstateAsset, assetEntity] as [RealEstateAsset, Asset];
	}

	private createStockAssetIdentity(ownerIdentity: string, stockData: StockData): [string, string] {
		return [
			`${ownerIdentity}-stock-asset-${stockData.exchange?.toLowerCase()}-${stockData.assetKind?.toString().toLowerCase()}-${stockData.symbol?.toLowerCase()}`,
			`${ownerIdentity}-asset-${stockData.exchange?.toLowerCase()}-${stockData.assetKind?.toString().toLowerCase()}-${stockData.symbol?.toLowerCase()}`
		];
	}

	private createRealEstateAssetIdentity(ownerIdentity: string, address: string): [string, string] {
		return [
			`${ownerIdentity}-realestate-asset-${address.replaceAll(" ", "-").toLowerCase()}`,
			`${ownerIdentity}-asset-${address.replaceAll(" ", "-").toLowerCase()}`
		];
	}
}
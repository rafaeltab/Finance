import { UnitOfWork, unitOfWork } from "#src/unitOfWork/unitOfWork";
import { Asset, AssetGroup, AssetValue, EntityKey, IAssetFactory, IAssetGroupFactory, RealEstateAsset, StockAsset, User, StockOrder, StockAssetKind } from "@finance/domain";
import { inject } from "tsyringe";

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

		assetEntity.stockAsset.orders.push(new StockOrder({
			amount,
			usdPrice: price,
		}))

		await this._unitOfWork.getQueryRunner().manager.save([assetEntity.stockAsset]);

		return assetEntity.stockAsset;
	}

	async addStockToAssetGroup(assetGroup: EntityKey, symbol: string, exchange: string, stockOrders: { amount: number, price: number }[]): Promise<[StockAsset, Asset]> {
		const assetGroupEntity = await this._unitOfWork.getQueryRunner().manager.findOne(AssetGroup, {
			where: assetGroup,
			relations: {
				assets: true,
			}
		});
		
		const [stockAssetEntity, assetEntity, stockOrderEntities] = await this.createStockAsset({
			kind: "group",
			entity: assetGroupEntity
		}, symbol, exchange, stockOrders);

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

		const [realEstateAsset, assetEntity] = await this.createRealEstateAsset({
			kind: "group",
			entity: assetGroupEntity
		}, address);

		await this._unitOfWork.getQueryRunner().manager.save([assetEntity, assetGroupEntity]);

		return [realEstateAsset, assetEntity];
	}
	async addStockToUser(user: EntityKey, symbol: string, exchange: string, stockOrders: { amount: number, price: number }[]): Promise<[StockAsset, Asset]> {
		const userEntity = await this._unitOfWork.getQueryRunner().manager.findOne(User, {
			where: user,
			relations: {
				assets: true,
			}
		});

		const [stockAssetEntity, assetEntity, stockOrderEntities] = await this.createStockAsset({
			kind: "user",
			entity: userEntity
		}, symbol, exchange, stockOrders);

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

		const [realEstateAsset, assetEntity] = await this.createRealEstateAsset({
			kind: "user",
			entity: userEntity
		}, address);

		await this._unitOfWork.getQueryRunner().manager.save([assetEntity, realEstateAsset]);

		return [realEstateAsset, assetEntity];
	}

	async addValueToAsset(asset: EntityKey, value: { usdValue: number; time: Date; }): Promise<AssetValue> {
		const assetEntity = await this._unitOfWork.getQueryRunner().manager.findOne(Asset, {
			where: asset,
			relations: {
				valueHistory: true,
			}
		});

		const valueEntity = new AssetValue({
			usdValue: value.usdValue,
			dateTime: value.time,
		});

		assetEntity.valueHistory.push(valueEntity);

		await this._unitOfWork.getQueryRunner().manager.save([assetEntity, valueEntity]);

		return valueEntity;
	}
	async addValuesToAsset(asset: EntityKey, values: { usdValue: number; time: Date; }[]): Promise<AssetValue[]> {
		const assetEntity = await this._unitOfWork.getQueryRunner().manager.findOne(Asset, {
			where: asset,
			relations: {
				valueHistory: true,
			}
		});

		let valueEntities = [];

		for (const v of values) {
			valueEntities.push(new AssetValue({
				usdValue: v.usdValue,
				dateTime: v.time,
			}));
		}

		assetEntity.valueHistory.push(...valueEntities);

		await this._unitOfWork.getQueryRunner().manager.save([assetEntity, ...valueEntities]);

		return valueEntities;
	}
	

	private async createStockAsset(ownerEntity: { kind: "user", entity: User } | { kind: "group", entity: AssetGroup }, symbol: string, exchange: string, stockOrders: { amount: number, price: number }[]) {
		const identities = this.createStockAssetIdentity(ownerEntity.entity.identity, symbol, exchange)[1]

		const stockAssetEntity = new StockAsset({
			symbol: symbol,
			exchange: exchange,
			identity: identities[0],
			assetKind: StockAssetKind.CS,
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

		ownerEntity.entity.assets.push(assetEntity);

		return [stockAssetEntity, assetEntity, stockAssetEntity.orders] as [StockAsset, Asset, StockOrder[]];
	}

	private async createRealEstateAsset(ownerEntity: { kind: "user", entity: User } | { kind: "group", entity: AssetGroup }, address: string) {
		const identities = this.createRealEstateAssetIdentity(ownerEntity.entity.identity, address)[1]

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

		ownerEntity.entity.assets.push(assetEntity);

		return [realEstateAsset, assetEntity] as [RealEstateAsset, Asset];
	}

	private createStockAssetIdentity(ownerIdentity: string, symbol: string, exchange: string): [string, string] {
		return [`${ownerIdentity}-stock-asset-${exchange.toLowerCase()}-${symbol.toLowerCase()}`, `${ownerIdentity}-asset-${exchange.toLowerCase()}-${symbol.toLowerCase()}`];
	}

	private createRealEstateAssetIdentity(ownerIdentity: string, address: string): [string, string] {
		return [`${ownerIdentity}-realestate-asset-${address.replaceAll(" ", "-").toLowerCase()}`, `${ownerIdentity}-asset-${address.replaceAll(" ", "-").toLowerCase()}`];
	}
}
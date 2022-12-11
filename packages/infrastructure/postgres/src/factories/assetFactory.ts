import { UnitOfWork, unitOfWork } from "#src/unitOfWork/unitOfWork";
import { Asset, AssetGroup, AssetValue, EntityKey, IAssetFactory, IAssetGroupFactory, RealEstateAsset, StockAsset, User } from "@finance/domain";
import { inject } from "tsyringe";

export class AssetFactory implements IAssetFactory {

	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }

	async addStockToAssetGroup(assetGroup: EntityKey, amount: number, symbol: string, exchange: string): Promise<[StockAsset, Asset]> {
		const assetGroupEntity = await this._unitOfWork.getQueryRunner().manager.findOne(AssetGroup, {
			where: assetGroup,
			relations: {
				assets: true,
			}
		});
		
		const [stockAssetEntity, assetEntity] = await this.createStockAsset({
			kind: "group",
			entity: assetGroupEntity
		}, amount, symbol, exchange);

		await this._unitOfWork.getQueryRunner().manager.save([assetEntity, assetGroupEntity]);

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
	async addStockToUser(user: EntityKey, amount: number, symbol: string, exchange: string): Promise<[StockAsset, Asset]> {
		const userEntity = await this._unitOfWork.getQueryRunner().manager.findOne(User, {
			where: user,
			relations: {
				assets: true,
			}
		});

		const [stockAssetEntity, assetEntity] = await this.createStockAsset({
			kind: "user",
			entity: userEntity
		}, amount, symbol, exchange);

		await this._unitOfWork.getQueryRunner().manager.save([assetEntity, userEntity]);

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
	

	private async createStockAsset(ownerEntity: { kind: "user", entity: User } | {kind: "group", entity: AssetGroup}, amount: number, symbol: string, exchange: string) {
		const identities = this.createStockAssetIdentity(ownerEntity.entity.identity, symbol, exchange)[1]

		const stockAssetEntity = new StockAsset({
			amount: amount,
			symbol: symbol,
			exchange: exchange,
			identity: identities[0]
		});
		const assetEntity = new Asset({
			identity: identities[1],
			stockAsset: stockAssetEntity,
		});

		if (ownerEntity.kind === "group") {
			assetEntity[ownerEntity.kind] = ownerEntity.entity;
		} else {
			assetEntity[ownerEntity.kind] = ownerEntity.entity;
		}

		ownerEntity.entity.assets.push(assetEntity);

		return [stockAssetEntity, assetEntity] as [StockAsset, Asset];
	}

	private async createRealEstateAsset(ownerEntity: { kind: "user", entity: User } | { kind: "group", entity: AssetGroup }, address: string) {
		const identities = this.createRealEstateAssetIdentity(ownerEntity.entity.identity, address)[1]

		const realEstateAsset = new RealEstateAsset({
			address: address,
			identity: identities[0]
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
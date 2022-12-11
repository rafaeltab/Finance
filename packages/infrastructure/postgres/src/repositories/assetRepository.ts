import { unitOfWork, UnitOfWork } from "#src/unitOfWork/unitOfWork";
import { EntityKey, IAssetRepository, PaginatedBase, Asset, ValueGranularity, AssetValue, GranularValueResult } from "@finance/domain";
import { inject } from "tsyringe";
import { SelectQueryBuilder } from "typeorm";

export class AssetRepository implements IAssetRepository {
	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }


	async getAllAssetsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Asset>> {
		const res = await this._unitOfWork.getQueryRunner().manager.findAndCount(Asset, {
			where: {
				user: user
			},
			skip: offset,
			take: limit,
		});

		return {
			page: {
				count: limit,
				offset: offset,
				total: res[1]
			},
			data: res[0]
		}
	}

	async getAllAssetsForAssetGroup(assetGroup: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Asset>> {
		const res = await this._unitOfWork.getQueryRunner().manager.findAndCount(Asset, {
			where: {
				group: assetGroup
			},
			skip: offset,
			take: limit,
		});

		return {
			page: {
				count: limit,
				offset: offset,
				total: res[1]
			},
			data: res[0]
		}
	}

	async get(id: EntityKey): Promise<Asset> {
		return await this._unitOfWork.getQueryRunner().manager.findOne(Asset, {
			where: id,
			relations: {
				stockAsset: true,
				realEstateAsset: true,
				valueHistory: true
			}
		});
	}

	async delete(id: EntityKey): Promise<void> {
		await this._unitOfWork.getQueryRunner().manager.delete(Asset, id);
	}

	async getValuesForAsset(asset: EntityKey, startDate: Date, endDate: Date, limit: number, offset: number): Promise<PaginatedBase<AssetValue>> {
		const res = await leftJoinAssetValue(
			this._unitOfWork.getQueryRunner().manager
				.createQueryBuilder(AssetValue
					, "av"), asset)
			.where("av.dateTime BETWEEN :startDate AND :endDate", { startDate, endDate })
			.skip(offset)
			.take(limit)
			.getManyAndCount();
		
		return {
			page: {
				count: limit,
				offset: offset,
				total: res[1]
			},
			data: res[0]
		}
	}

	async getGranularValuesForAsset(asset: EntityKey, startDate: Date, endDate: Date, granularity: ValueGranularity, limit: number, offset: number): Promise<PaginatedBase<GranularValueResult>> {
		switch (granularity) {
			case "day":
			case "hour":
			case "month":
			case "year":
				break;				
			default:
				throw new Error("Invalid granularity");
		}

		const res = await this._unitOfWork.getQueryRunner().manager
			.createQueryBuilder()
			.select("t.*, count(t.*) OVER() as total")
			.from(subQuery =>
				leftJoinAssetValue(subQuery.from(AssetValue, "av"), asset)					
					.select("min(av.dateTime)", "startTime")
					.addSelect("max(av.dateTime)", "endTime")
					.addSelect("min(av.usdValue)", "minValue")
					.addSelect("max(av.usdValue)", "maxValue")
					.addSelect("avg(av.usdValue)", "avgValue")					
					.andWhere("av.dateTime BETWEEN :startDate AND :endDate", { startDate, endDate })
					.groupBy(`DATE_TRUNC('${granularity}', av.dateTime)`)
				, "t")
			.getRawMany<GranularValueResult & {
				total: number
			}>();
		
		return {
			page: {
				count: limit,
				offset: offset,
				total: (res[0] ?? {total: 0}).total
			},
			data: res
		}
	}
}

function leftJoinAssetValue(queryBuilder: SelectQueryBuilder<AssetValue>, asset: EntityKey) {
	if ("uniqueId" in asset) {
		return queryBuilder.where("av.assetUniqueId = :assetId", { assetId: asset.uniqueId })
	} else {
		return queryBuilder.leftJoinAndSelect("av.asset", "a", "a.identity = :assetId", { assetId: asset.identity })
	}
}
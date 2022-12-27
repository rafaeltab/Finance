import { UnitOfWork, unitOfWork } from "#src/unitOfWork/unitOfWork";
import { EntityKey, IStockRepository, PaginatedBase, StockAssetKind, StockData, StockDividendEvent, StockSplitEvent, StockValue, TimeRange, ValueGranularity } from "@finance/domain";
import { set } from "lodash";
import { inject } from "tsyringe";
import { EntityManager, EntityMetadata, EntityTarget, FindOptionsWhere, In, Like, ObjectLiteral } from "typeorm";

const granularities = new Set(["minute", "hour", "day", "week", "month", "year"]);

export class StockRepository implements IStockRepository {
	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }


	async getAllStockData(withValues?: boolean, limit?: number, offset?: number): Promise<PaginatedBase<StockData>> {
		const stockData = await this._unitOfWork.getQueryRunner().manager.findAndCount(StockData, {
			skip: offset,
			take: limit,
		});

		if (withValues !== true) {
			return {
				data: stockData[0],
				page: {
					count: stockData[0].length,
					offset: offset,
					total: stockData[1]
				}
			}
		}

		return {
			data: await this.addValuesToStockData(stockData[0]),
			page: {
				count: stockData[0].length,
				offset: offset,
				total: stockData[1]
			}
		}
	}

	async getStockValues(stockDataId: EntityKey, granularity: ValueGranularity, timerange: TimeRange, limit?: number, offset?: number): Promise<PaginatedBase<StockValue>> {
		let isValidGranularity = granularities.has(granularity);
		if (!isValidGranularity) {
			throw new Error("Invalid granularity");
		}

		const stockData = await this._unitOfWork.getQueryRunner().manager.findOne(StockData, {
			where: stockDataId
		});

		const trunc = `DATE_TRUNC('${granularity}', "sv"."date")`
		const groupby = `${trunc}`
		const distinct = [trunc];

		const stockId = { stockId: stockData.uniqueId };

		const entityManager = this._unitOfWork.getQueryRunner().manager;
		const queryResult = await entityManager
			.createQueryBuilder()
			.from((subQuery) => {
				return subQuery
					.from((subQuery) => {
						return subQuery.from(StockValue, "sv")
							.distinctOn(distinct)
							.where("sv.stockDataUniqueId = :stockId", stockId)
							.andWhere("sv.date >= :startDate", { startDate: timerange.start })
							.andWhere("sv.date <= :endDate", { endDate: timerange.end })
							.addSelect(`"sv"."open"`, "open")
							.addSelect(trunc, "trunc")
							.addOrderBy(trunc)
							.addOrderBy(`"sv"."date"`)
					}, "o")
					.innerJoin((subQuery) => {
						return subQuery.from(StockValue, "sv")
							.distinctOn(distinct)
							.where("sv.stockDataUniqueId = :stockId", stockId)
							.andWhere("sv.date >= :startDate", { startDate: timerange.start })
							.andWhere("sv.date <= :endDate", { endDate: timerange.end })
							.addSelect(`"sv"."close"`, "close")
							.addSelect(trunc, "trunc")
							.addOrderBy(trunc)
							.addOrderBy(`"sv"."date"`, "DESC")
					}, "c", `"o"."trunc" = "c"."trunc"`)
					.innerJoin((subQuery) => {
						return subQuery.from(StockValue, "sv")
							.where("sv.stockDataUniqueId = :stockId", stockId)
							.andWhere("sv.date >= :startDate", { startDate: timerange.start })
							.andWhere("sv.date <= :endDate", { endDate: timerange.end })
							.addSelect(`max("sv"."date")`, "date")
							.addSelect(`min("sv"."low")`, "low")
							.addSelect(`max("sv"."high")`, "high")
							.addSelect(`sum("sv"."volume")`, "volume")
							.addSelect(trunc, "trunc")
							.groupBy(groupby)
					}, "lhv", `"lhv"."trunc" = "o"."trunc"`)
					.select(`"o"."open"`, "open")
					.addSelect(`"c"."close"`, "close")
					.addSelect(`"lhv"."low"`, "low")
					.addSelect(`"lhv"."high"`, "high")
					.addSelect(`"lhv"."volume"`, "volume")
					.addSelect(`"lhv"."date"`, "date")
			}, "res")
			.select(`res.*`)
			.addSelect(`count(res.*) OVER ()`, `total`)
			.skip(offset)
			.limit(limit)
			.getRawMany();


		const stockValues = mapRawsToEntities(StockValue, queryResult, entityManager);

		return {
			data: stockValues as any,
			page: {
				count: stockValues.length,
				offset: offset,
				total: queryResult[0].total
			}
		}
	}

	async getStockEvents(stockDataId: EntityKey, timerange: TimeRange, limit?: number, offset?: number): Promise<[StockDividendEvent[], StockSplitEvent[]]> {
		const stockData = await this._unitOfWork.getQueryRunner().manager.findOne(StockData, {
			where: stockDataId,
			relations: {
				splitEvents: true,
				dividendsEvents: true
			}
		});

		return [stockData.dividendsEvents, stockData.splitEvents];
	}

	async searchStockData(symbol?: string, exchange?: string, stockType?: string, withValues?: boolean, limit?: number, offset?: number): Promise<PaginatedBase<StockData>> {
		const kinds: `${StockAssetKind}`[] = Object.values(StockAssetKind);

		let allowedKinds: `${StockAssetKind}`[] = [];
		if (stockType !== undefined) {
			allowedKinds = kinds.filter(kind => kind.includes(stockType));
		} else {
			allowedKinds = kinds;
		}

		let where: FindOptionsWhere<StockData> = {
			assetKind: In(allowedKinds),
		}
		if (symbol !== undefined) {
			where.symbol = Like(`%${symbol}%`);
		}
		if (exchange !== undefined) {
			where.exchange = Like(`%${exchange}%`);
		}


		const stockData = await this._unitOfWork.getQueryRunner().manager.findAndCount(StockData, {
			where: where,
			order: {
				symbol: "ASC",
				exchange: "ASC",
				assetKind: "ASC"
			},
			skip: offset,
			take: limit
		});

		if (withValues !== true) {
			return {
				data: stockData[0],
				page: {
					count: stockData[0].length,
					offset: offset,
					total: stockData[1]
				}
			}
		}

		return {
			data: await this.addValuesToStockData(stockData[0]),
			page: {
				count: stockData[0].length,
				offset: offset,
				total: stockData[1]
			}
		}
	}

	private async addValuesToStockData(stockData: StockData[]) {
		var twoYearsAgo = new Date();
		twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

		var stockDataMap = new Map<string, StockData>();
		stockData.forEach(x => stockDataMap.set(x.uniqueId, x));

		const trunc = `DATE_TRUNC('month', "sv"."date")`
		const stockDataUniqueId = `"sv"."stockDataUniqueId"`
		const groupby = `${stockDataUniqueId}, ${trunc}`
		const distinct = [trunc,
			stockDataUniqueId];

		const stockIds = { stockIds: stockData.map(x => x.uniqueId) }

		const entityManager = this._unitOfWork.getQueryRunner().manager;
		const queryResult = await entityManager
			.createQueryBuilder()
			.from((subQuery) => {
				return subQuery.from(StockValue, "sv")
					.distinctOn(distinct)
					.where("sv.stockDataUniqueId in (:...stockIds)", stockIds)
					.andWhere("sv.date >= :startDate", { startDate: twoYearsAgo })
					.addSelect(`"sv"."open"`, "open")
					.addSelect(trunc, "trunc")
					.addSelect(stockDataUniqueId, "stockDataUniqueId")
					.addOrderBy(trunc)
					.addOrderBy(stockDataUniqueId)
					.addOrderBy(`"sv"."date"`)
			}, "o")
			.innerJoin((subQuery) => {
				return subQuery.from(StockValue, "sv")
					.distinctOn(distinct)
					.where("sv.stockDataUniqueId in (:...stockIds)", stockIds)
					.andWhere("sv.date >= :startDate", { startDate: twoYearsAgo })
					.addSelect(`"sv"."close"`, "close")
					.addSelect(trunc, "trunc")
					.addSelect(stockDataUniqueId, "stockDataUniqueId")
					.addOrderBy(trunc)
					.addOrderBy(stockDataUniqueId)
					.addOrderBy(`"sv"."date"`, "DESC")
			}, "c", `"o"."trunc" = "c"."trunc" AND "o"."stockDataUniqueId" = "c"."stockDataUniqueId"`)
			.innerJoin((subQuery) => {
				return subQuery.from(StockValue, "sv")
					.where("sv.stockDataUniqueId in (:...stockIds)", stockIds)
					.andWhere("sv.date >= :startDate", { startDate: twoYearsAgo })
					.addSelect(`max("sv"."date")`, "date")
					.addSelect(`min("sv"."low")`, "low")
					.addSelect(`max("sv"."high")`, "high")
					.addSelect(`sum("sv"."volume")`, "volume")
					.addSelect(stockDataUniqueId, "stockDataUniqueId")
					.addSelect(trunc, "trunc")
					.groupBy(groupby)
			}, "lhv", `"lhv"."trunc" = "o"."trunc" AND "lhv"."stockDataUniqueId" = "o"."stockDataUniqueId"`)
			.select(`"o"."open"`, "open")
			.addSelect(`"c"."close"`, "close")
			.addSelect(`"lhv"."low"`, "low")
			.addSelect(`"lhv"."high"`, "high")
			.addSelect(`"lhv"."volume"`, "volume")
			.addSelect(`"lhv"."date"`, "date")
			.addSelect(`"lhv"."stockDataUniqueId"`, "stockDataUniqueId")
			.getRawMany();

		const stockValues = mapRawsToEntities(StockValue, queryResult, entityManager);

		for (const value of stockValues) {
			if (stockDataMap.get(value.stockData.uniqueId).values == undefined) {
				stockDataMap.get(value.stockData.uniqueId).values = [];
			}
			stockDataMap.get(value.stockData.uniqueId).values.push(value);
		}
		return Array.from(stockDataMap.values());
	}
}

function mapRawsToEntities<T>(entity: EntityTarget<T>, raw: ObjectLiteral[], entityManager: EntityManager): T[] {
	const meta = entityManager.connection.getMetadata(entity);
	return raw.map((r) => mapRawToEntity(entity, r, entityManager, meta));
}

function mapRawToEntity<T>(entity: EntityTarget<T>, raw: ObjectLiteral, entityManager: EntityManager, meta?: EntityMetadata): T {
	var result: Partial<T> = {}
	
	if(meta === undefined) {
		meta = entityManager.connection.getMetadata(entity);
	}

	for (const column of meta.columns) {
		if (raw[column.databaseName] !== undefined) {
			let value = raw[column.databaseName];
			if (column.transformer !== undefined) { 
				let transformers = column.transformer;
				if (!Array.isArray(transformers)) { 
					transformers = [transformers];
				}

				for (const transformer of transformers) {
					value = transformer.from(value);
				}
			}

			set(result, column.propertyPath, value)
		}
	}

	return result as T;
}
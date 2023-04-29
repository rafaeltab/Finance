import { EntityKey, IAssetRepository, PaginatedBase, Asset, getKey } from "@finance/svc-user-domain";
import { EntryNotFoundError } from "@finance/lib-errors";
import { inject, injectable } from "tsyringe";
import { unitOfWorkToken, UnitOfWork } from "../unitOfWork/unitOfWork";

@injectable()
export class AssetRepository implements IAssetRepository {
    constructor(@inject(unitOfWorkToken) private unitOfWork: UnitOfWork) { }


    async getAllAssetsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Asset>> {
        const res = await this.unitOfWork.getQueryRunner().manager.findAndCount(Asset, {
            where: {
                user
            },
            skip: offset,
            take: limit,
            relations: {
                realEstateAsset: true,
                stockAsset: true,
            }
        });

        return {
            page: {
                count: limit,
                offset,
                total: res[1]
            },
            data: res[0]
        }
    }

    async getAllAssetsForAssetGroup(assetGroup: EntityKey, limit: number, offset: number): Promise<PaginatedBase<Asset>> {
        const res = await this.unitOfWork.getQueryRunner().manager.findAndCount(Asset, {
            where: {
                group: assetGroup
            },
            skip: offset,
            take: limit,
            relations: {
                realEstateAsset: true,
                stockAsset: true,
            }
        });

        return {
            page: {
                count: limit,
                offset,
                total: res[1]
            },
            data: res[0]
        }
    }

    async get(id: EntityKey): Promise<Asset> {
        const asset = await this.unitOfWork.getQueryRunner().manager.findOne(Asset, {
            where: id,
            relations: {
                stockAsset: true,
                realEstateAsset: true,
            }
        });

        if (!asset) {
            throw new EntryNotFoundError(Asset.name, getKey(id));
        }

        return asset;
    }

    async delete(id: EntityKey): Promise<void> {
        const res = await this.unitOfWork.getQueryRunner().manager.delete(Asset, id);
        if ((res.affected ?? 0)===0) {
            throw new EntryNotFoundError(Asset.name, getKey(id));
        }
    }
}
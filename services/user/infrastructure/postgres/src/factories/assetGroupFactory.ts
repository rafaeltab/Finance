import { AssetGroup, EntityKey, IAssetGroupFactory, User, getKey } from "@finance/svc-user-domain";
import { DuplicateEntryError, EntryNotFoundError, UnexpectedError } from "@finance/lib-errors";
import { inject, injectable } from "tsyringe";
import { UnitOfWork, unitOfWorkToken } from "../unitOfWork/unitOfWork";

@injectable()
export class AssetGroupFactory implements IAssetGroupFactory {

    constructor(@inject(unitOfWorkToken) private unitOfWork: UnitOfWork) { }

    async addAssetGroupToUser(user: EntityKey, name: string): Promise<AssetGroup> {
        const userEntity = await this.unitOfWork.getQueryRunner().manager.findOne(User, {
            where: user,
            relations: {
                assetGroups: true,
            }
        });

        if (!userEntity) {
            throw new EntryNotFoundError(User.name, getKey(user));
        }

        const identity = this.createIdentity(userEntity, name);

        const existingAssetGroup = await this.unitOfWork.getQueryRunner().manager.findOne(AssetGroup, {
            where: {
                identity
            }
        });

        if (existingAssetGroup != null) {
            throw new DuplicateEntryError(AssetGroup.name, identity);
        }

        const assetGroup = new AssetGroup({
            name,
            identity
        })

        if (userEntity.assetGroups === undefined) {
            throw new UnexpectedError(new Error("Asset groups not loaded"));
        }

        userEntity.assetGroups.push(assetGroup);

        await this.unitOfWork.getQueryRunner().manager.save([assetGroup, userEntity]);

        return assetGroup;
    }

    private createIdentity(user: User, name: string): string {
        return `${user.identity}-assetGroup-${name.toLowerCase()}`;
    }
}
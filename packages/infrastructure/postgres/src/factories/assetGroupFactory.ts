import { UnitOfWork, unitOfWork } from "../unitOfWork/unitOfWork";
import { AssetGroup, EntityKey, IAssetGroupFactory, User } from "@finance/domain";
import { inject, injectable } from "tsyringe";

@injectable()
export class AssetGroupFactory implements IAssetGroupFactory {

	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }

	async addAssetGroupToUser(user: EntityKey, name: string): Promise<AssetGroup> {
		const userEntity = await this._unitOfWork.getQueryRunner().manager.findOne(User, {
			where: user,
			relations: {
				assetGroups: true,
			}
		});

		if (!userEntity) {
			throw new Error("User not found");
		}

		const assetGroup = new AssetGroup({
			name: name,
			identity: this.createIdentity(userEntity, name)
		})

		if (userEntity.assetGroups === undefined) {
			throw new Error("Asset groups not loaded");
		}

		userEntity.assetGroups.push(assetGroup);

		await this._unitOfWork.getQueryRunner().manager.save([assetGroup, userEntity]);

		return assetGroup;
	}

	private createIdentity(user: User, name: string): string {
		return `${user.identity}-assetGroup-${name.toLowerCase()}`;
	}
}
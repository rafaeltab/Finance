import { UnitOfWork, unitOfWork } from "#src/unitOfWork/unitOfWork";
import { AssetGroup, EntityKey, IAssetGroupFactory, User } from "@finance/domain";
import { inject } from "tsyringe";

export class AssetGroupFactory implements IAssetGroupFactory {

	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }

	async addAssetGroupToUser(user: EntityKey, name: string): Promise<AssetGroup> {
		const userEntity = await this._unitOfWork.getQueryRunner().manager.findOne(User, {
			where: user,
			relations: {
				assetGroups: true,
			}
		});

		const assetGroup = new AssetGroup({
			name: name,
			identity: this.createIdentity(userEntity, name)
		})

		userEntity.assetGroups.push(assetGroup);

		await this._unitOfWork.getQueryRunner().manager.save([assetGroup, userEntity]);

		return assetGroup;
	}

	private createIdentity(user: User, name: string): string {
		return `${user.identity}-assetGroup-${name.toLowerCase()}`;
	}
}
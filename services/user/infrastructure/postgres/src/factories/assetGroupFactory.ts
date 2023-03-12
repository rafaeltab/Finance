import { UnitOfWork, unitOfWork } from "../unitOfWork/unitOfWork";
import { AssetGroup, EntityKey, IAssetGroupFactory, User, getKey } from "@finance/domain";
import { DuplicateEntryError, EntryNotFoundError, UnexpectedError } from "@finance/errors";
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
			throw new EntryNotFoundError(User.name, getKey(user));
		}

		const identity = this.createIdentity(userEntity, name);

		const existingAssetGroup = await this._unitOfWork.getQueryRunner().manager.findOne(AssetGroup, {
			where: {
				identity
			}
		});

		if (existingAssetGroup != null) {
			throw new DuplicateEntryError(AssetGroup.name, identity);
		}

		const assetGroup = new AssetGroup({
			name: name,
			identity: identity
		})

		if (userEntity.assetGroups === undefined) {
			throw new UnexpectedError(new Error("Asset groups not loaded"));
		}

		userEntity.assetGroups.push(assetGroup);

		await this._unitOfWork.getQueryRunner().manager.save([assetGroup, userEntity]);

		return assetGroup;
	}

	private createIdentity(user: User, name: string): string {
		return `${user.identity}-assetGroup-${name.toLowerCase()}`;
	}
}
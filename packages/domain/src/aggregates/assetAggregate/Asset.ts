import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AssetGroup } from "../AssetGroup";
import { EnitityBase } from "../../utils/Entity";
import { User } from "../User";
import { StockAsset } from "./assetKinds/StockAsset";
import { RealEstateAsset } from "./assetKinds/RealEstateAsset";
import { EntityMeta } from "@finance/libs-types";

@Entity()
export class Asset extends EnitityBase {
	@OneToOne(() => StockAsset, stockAsset => stockAsset.asset, {
		eager: true,
		cascade: ["insert"]
	})
	stockAsset?: StockAsset;
	@OneToOne(() => RealEstateAsset, realEstateAsset => realEstateAsset.asset, {
		eager: true,
		cascade: ["insert"]
	})
	realEstateAsset?: RealEstateAsset;

	@ManyToOne(() => AssetGroup, (group) => group.assets, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	@JoinColumn()
	group: AssetGroup;

	@ManyToOne(() => User, (user) => user.assets, {
		onDelete: "CASCADE",
	})
	user: User;

	constructor(init: Partial<Asset>) {
		super();
		Object.assign(this, init);
	}
}

export const AssetMeta: EntityMeta<Asset> = {
	relations: ["group", "user", "stockAsset", "realEstateAsset"],
	data: ["uniqueId", "identity"]
}
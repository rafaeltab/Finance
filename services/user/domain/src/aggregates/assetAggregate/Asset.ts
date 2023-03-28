import { Entity, JoinColumn, ManyToOne, OneToOne, Relation } from "typeorm";
import type { EntityMeta } from "@finance/lib-basic-types";
import { AssetGroup } from "../AssetGroup";
import { EnitityBase } from "../../utils/Entity";
import { User } from "../User";
import { StockAsset } from "./assetKinds/StockAsset";
import { RealEstateAsset } from "./assetKinds/RealEstateAsset";

@Entity()
export class Asset extends EnitityBase {
	@OneToOne(() => StockAsset, stockAsset => stockAsset.asset, {
		eager: true,
		cascade: ["insert"]
	})
	stockAsset?: Relation<StockAsset>;

	@OneToOne(() => RealEstateAsset, realEstateAsset => realEstateAsset.asset, {
		eager: true,
		cascade: ["insert"]
	})
	realEstateAsset?: Relation<RealEstateAsset>;

	@ManyToOne(() => AssetGroup, (group) => group.assets, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	@JoinColumn()
	group?: Relation<AssetGroup>;

	@ManyToOne(() => User, (user) => user.assets, {
		onDelete: "CASCADE",
	})
	user?: Relation<User>;

	constructor(init: Partial<Asset>) {
		super();
		Object.assign(this, init);
	}
}

export const AssetMeta: EntityMeta<Asset> = {
	relations: ["group", "user", "stockAsset", "realEstateAsset"],
	data: ["uniqueId", "identity"]
}
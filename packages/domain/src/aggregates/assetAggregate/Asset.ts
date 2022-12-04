import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { AssetGroup } from "../AssetGroup";
import { EnitityBase } from "../../bases/Entity";
import { User } from "../User";
import { AssetValue } from "./Value";
import { StockAsset } from "./assetKinds/StockAsset";
import { RealEstateAsset } from "./assetKinds/RealEstateAsset";
import { EntityMeta } from "@finance/libs-types";

@Entity()
export class Asset extends EnitityBase { 
	get CurrentValue() { 
		return this.valueHistory[this.valueHistory.length - 1];
	}

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

	@OneToMany(() => AssetValue, (value) => value.asset)
	valueHistory: AssetValue[];

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
	relations: ["group", "user", "stockAsset", "realEstateAsset", "valueHistory"],
	data: ["uniqueId", "identity"]
}
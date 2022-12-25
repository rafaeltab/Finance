import { EntityMeta } from "@finance/libs-types";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { EnitityBase } from "../utils/Entity";
import { Asset } from "./assetAggregate/Asset";
import { User } from "./User";

@Entity()
export class AssetGroup extends EnitityBase { 
	@Column()
	name: string;
	
	@OneToMany(() => Asset, asset => asset.group, {
		eager: true,
		cascade: ["insert"]
	})
	assets: Asset[];

	@ManyToOne(() => User, (user) => user.assetGroups, {
		onDelete: "CASCADE",
	})
	@JoinColumn()
	user: User;

	constructor(init: Partial<AssetGroup>) {
		super();
		Object.assign(this, init);
	}
}


export const AssetGroupMeta: EntityMeta<AssetGroup> = {
	relations: ["user", "assets"],
	data: ["name", "uniqueId", "identity"]
}
import { EntityMeta } from "@finance/libs-types";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ValueObjectBase } from "../../bases";
import { Asset } from "./Asset";

@Entity()
export class AssetValue extends ValueObjectBase { 
	@Column({
		type: "decimal",
		scale: 3
	})
	usdValue: number;

	@Column()
	dateTime: Date;

	@ManyToOne(() => Asset, (asset) => asset.valueHistory, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	@JoinColumn()
	asset: Asset;

	constructor(init: Partial<AssetValue>) {
		super();
		Object.assign(this, init);
	}
}

export const AssetValueMeta: EntityMeta<AssetValue> = {
	relations: ["asset"],
	data: ["usdValue", "dateTime", "uniqueId"]
}
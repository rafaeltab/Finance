import { EntityMeta } from "@finance/libs-types";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { EnitityBase } from "../../../bases";
import { Asset } from "../Asset";
import { RealEstateAsset } from "./RealEstateAsset";

@Entity()
export class StockAsset extends EnitityBase {
	@Column()
	amount: number;

	@Column()
	symbol: string;

	@Column()
	exchange: string;

	@OneToOne(() => Asset, (asset) => asset.stockAsset, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	@JoinColumn()
	asset: Asset;

	constructor(init: Partial<StockAsset>) {
		super();
		Object.assign(this, init);
	}
}

export const StockAssetMeta: EntityMeta<RealEstateAsset> = {
	relations: ["asset"],
	data: ["address", "uniqueId", "identity"]
}
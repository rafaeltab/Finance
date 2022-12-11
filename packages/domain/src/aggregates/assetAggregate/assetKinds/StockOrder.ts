import { EntityMeta } from "@finance/libs-types";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { EnitityBase, ValueObjectBase } from "../../../bases";
import { StockAsset } from "./StockAsset";


@Entity()
export class StockOrder extends ValueObjectBase {
	@Column({
		type: "decimal",
		scale: 3
	})
	amount: number;

	@Column({
		type: "decimal",
		scale: 3
	})
	usdPrice: number;

	@ManyToOne(() => StockAsset, (asset) => asset.orders, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	@JoinColumn()
	stockAsset: StockAsset;

	constructor(init: Partial<StockOrder>) {
		super();
		Object.assign(this, init);
	}
}

export const StockOrderMeta: EntityMeta<StockOrder> = {
	relations: ["stockAsset"],
	data: ["amount", "usdPrice", "uniqueId"]
}
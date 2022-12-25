import { EntityMeta } from "@finance/libs-types";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { EnitityBase, ValueObjectBase } from "../../../utils";
import { StockAsset } from "./StockAsset";
import { ColumnNumericTransformer } from "../../../utils/numericTransformer";


@Entity()
export class StockOrder extends ValueObjectBase {
	@Column({
		type: "decimal",
		scale: 3,
		transformer: new ColumnNumericTransformer()
	})
	amount: number;

	@Column({
		type: "decimal",
		scale: 3,
		transformer: new ColumnNumericTransformer()
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
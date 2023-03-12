import type { EntityMeta } from "@finance/lib-basic-types";
import { Column, Entity, JoinColumn, ManyToOne, Relation } from "typeorm";
import { ValueObjectBase } from "../../../utils";
import { StockAsset } from "./StockAsset";
import { ColumnNumericTransformer } from "../../../utils/numericTransformer";


@Entity()
export class StockOrder extends ValueObjectBase {
	@Column({
		type: "decimal",
		scale: 3,
		transformer: new ColumnNumericTransformer()
	})
	amount?: number;

	@Column({
		type: "decimal",
		scale: 3,
		transformer: new ColumnNumericTransformer()
	})
	usdPrice?: number;

	@ManyToOne(() => StockAsset, (asset) => asset.orders, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	@JoinColumn()
	stockAsset?: Relation<StockAsset>;

	constructor(init: Partial<StockOrder>) {
		super();
		Object.assign(this, init);
	}
}

export const StockOrderMeta: EntityMeta<StockOrder> = {
	relations: ["stockAsset"],
	data: ["amount", "usdPrice", "uniqueId"]
}
import type { EntityMeta } from "@finance/libs-types";
import { Column, Entity, ManyToOne, Relation } from "typeorm";
import { ValueObjectBase } from "../../utils";
import { StockData } from "./StockData";
import { ColumnNumericTransformer } from "../../utils/numericTransformer";

@Entity()
export class StockValue extends ValueObjectBase {
	@Column("numeric", {
		scale: 3,
		precision: 10,
		transformer: new ColumnNumericTransformer()
	})
	open?: number;

	@Column({
		type: "numeric",
		scale: 3,
		transformer: new ColumnNumericTransformer()
	})
	high?: number;

	@Column({
		type: "numeric",
		scale: 3,
		transformer: new ColumnNumericTransformer()
	})
	low?: number;

	@Column({
		type: "numeric",
		scale: 3,
		transformer: new ColumnNumericTransformer()
	})
	close?: number;

	@Column({
		type: "numeric",
		scale: 3,
		transformer: new ColumnNumericTransformer()
	})
	volume?: number;

	@Column()
	date?: Date;

	@ManyToOne(() => StockData, (stockData) => stockData.values, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	stockData?: Relation<StockData>;

	constructor(init: Partial<StockValue>) {
		super();
		Object.assign(this, init);
	}
}

export const StockValueMeta: EntityMeta<StockValue> = {
	relations: ["stockData"],
	data: ["open", "high", "low", "close", "volume", "date", "uniqueId"]
}

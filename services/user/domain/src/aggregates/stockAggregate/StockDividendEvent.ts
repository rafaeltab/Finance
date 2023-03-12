import type { EntityMeta } from "@finance/libs-types";
import { Column, Entity, ManyToOne, Relation } from "typeorm";
import { ValueObjectBase } from "../../utils";
import { StockData } from "./StockData";
import { ColumnNumericTransformer } from "../../utils/numericTransformer";


@Entity()
export class StockDividendEvent extends ValueObjectBase {
	@Column()
	date?: Date;

	@Column({
		type: "decimal",
		precision: 10,
		transformer: new ColumnNumericTransformer()
	})
	amount?: number;

	@ManyToOne(() => StockData, (data) => data.dividendsEvents, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	stockData?: Relation<StockData>;

	constructor(init: Partial<StockDividendEvent>) {
		super();
		Object.assign(this, init);
	}
}

export const StockDividendEventMeta: EntityMeta<StockDividendEvent> = {
	relations: ["stockData"],
	data: ["amount", "date", "uniqueId"]
}
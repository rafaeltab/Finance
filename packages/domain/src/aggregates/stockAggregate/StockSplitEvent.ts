import type { EntityMeta } from "@finance/libs-types";
import { Column, Entity, ManyToOne, Relation } from "typeorm";
import { ValueObjectBase } from "../../utils";
import { StockData } from "./StockData";
import { ColumnNumericTransformer } from "../../utils/numericTransformer";


@Entity()
export class StockSplitEvent extends ValueObjectBase { 
	@Column()
	date?: Date;

	@Column({
		type: "decimal",
		precision: 10,
		transformer: new ColumnNumericTransformer()
	})
	ratio?: number;

	@ManyToOne(() => StockData, (data) => data.splitEvents, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	stockData?: Relation<StockData>;

	constructor(init: Partial<StockSplitEvent>) {
		super();
		Object.assign(this, init);
	}
}

export const StockSplitEventMeta: EntityMeta<StockSplitEvent> = {
	relations: ["stockData"],
	data: ["ratio", "date", "uniqueId"]
}
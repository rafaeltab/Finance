import { EntityMeta } from "@finance/libs-types";
import { Column, Entity, ManyToOne } from "typeorm";
import { ValueObjectBase } from "../../bases";
import { StockData } from "./StockData";


@Entity()
export class StockSplitEvent extends ValueObjectBase { 
	@Column()
	date: Date;

	@Column({
		type: "decimal",
		precision: 10,
	})
	ratio: number;

	@ManyToOne(() => StockData, (data) => data.splitEvents, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	stockData: StockData;

	constructor(init: Partial<StockSplitEvent>) {
		super();
		Object.assign(this, init);
	}
}

export const StockSplitEventMeta: EntityMeta<StockSplitEvent> = {
	relations: ["stockData"],
	data: ["ratio", "date", "uniqueId"]
}
import { EntityMeta } from "@finance/libs-types";
import { Column, Entity, ManyToOne } from "typeorm";
import { ValueObjectBase } from "../../bases";
import { StockData } from "./StockData";

@Entity()
export class StockValue extends ValueObjectBase {
	@Column({
		type: "decimal",
		scale: 3
	})
	open: number;

	@Column({
		type: "decimal",
		scale: 3
	})
	high: number;

	@Column({
		type: "decimal",
		scale: 3
	})
	low: number;

	@Column({
		type: "decimal",
		scale: 3
	})
	close: number;

	@Column({
		type: "decimal",
		scale: 3
	})
	volume: number;

	@Column()
	date: Date;

	@ManyToOne(() => StockData, (stockData) => stockData.values, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	stockData: StockData;

	constructor(init: Partial<StockValue>) {
		super();
		Object.assign(this, init);
	}
}

export const StockValueMeta: EntityMeta<StockValue> = {
	relations: ["stockData"],
	data: ["open", "high", "low", "close", "volume", "date", "uniqueId"]
}

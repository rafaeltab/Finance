import { EntityMeta } from "@finance/libs-types";
import { Column, Entity, OneToMany } from "typeorm";
import { EnitityBase } from "../../bases";
import { StockDividendEvent } from "./StockDividendEvent";
import { StockSplitEvent } from "./StockSplitEvent";
import { StockValue } from "./StockValue";

export enum StockAssetKind {
	CS = "CS",
	ADRC = "ADRC",
	ADRP = "ADRP",
	ADRR = "ADRR",
	UNIT = "UNIT",
	RIGHT = "RIGHT",
	PFD = "PFD",
	FUND = "FUND",
	SP = "SP",
	WARRANT = "WARRANT",
	INDEX = "INDEX",
	ETF = "ETF",
	ETN = "ETN",
	OS = "OS",
	GDR = "GDR",
	OTHER = "OTHER",
	NYRS = "NYRS",
	AGEN = "AGEN",
	EQLK = "EQLK",
	BOND = "BOND",
	ADRW = "ADRW",
	BASKET = "BASKET",
	LT = "LT",
}

@Entity()
export class StockData extends EnitityBase {
	@Column()
	symbol: string;

	@Column()
	exchange: string;

	@Column({
		type: "enum",
		enum: StockAssetKind,
	})
	assetKind: StockAssetKind;

	@OneToMany(() => StockValue, (value) => value.stockData)
	values: StockValue[];

	@OneToMany(() => StockSplitEvent, (event) => event.stockData)
	splitEvents: StockSplitEvent[];

	@OneToMany(() => StockDividendEvent, (event) => event.stockData)
	dividendsEvents: StockDividendEvent[];

	constructor(init: Partial<StockData>) {
		super();
		Object.assign(this, init);
	}
}

export const StockDataMeta: EntityMeta<StockData> = {
	relations: ["values"],
	data: ["symbol", "exchange", "assetKind", "uniqueId", "identity"]
}

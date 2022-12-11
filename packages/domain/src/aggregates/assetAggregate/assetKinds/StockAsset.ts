import { EntityMeta } from "@finance/libs-types";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { EnitityBase } from "../../../bases";
import { Asset } from "../Asset";
import { StockOrder } from "./StockOrder";


export const stockAssetKinds = [
	"CS",
	"ADRC",
	"ADRP",
	"ADRR",
	"UNIT",
	"RIGHT",
	"PFD",
	"FUND",
	"SP",
	"WARRANT",
	"INDEX",
	"ETF",
	"ETN",
	"OS",
	"GDR",
	"OTHER",
	"NYRS",
	"AGEN",
	"EQLK",
	"BOND",
	"ADRW",
	"BASKET",
	"LT",
] as const;

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
export class StockAsset extends EnitityBase {

	@Column()
	symbol: string;

	@Column()
	exchange: string;

	@Column({
		type: "enum",
		enum: stockAssetKinds,
	})
	assetKind: StockAssetKind;

	@OneToMany(() => StockOrder, (order) => order.stockAsset, {
		eager: true
	})
	orders: StockOrder[];

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

export const StockAssetMeta: EntityMeta<StockAsset> = {
	relations: ["asset", "orders"],
	data: ["symbol", "exchange", "uniqueId", "identity"]
}
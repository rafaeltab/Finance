import { EntityMeta } from "@finance/libs-types";
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { EnitityBase } from "../../../bases";
import { StockData } from "../../stockAggregate/StockData";
import { Asset } from "../Asset";
import { StockOrder } from "./StockOrder";

@Entity()
export class StockAsset extends EnitityBase {

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

	@ManyToOne(() => StockData, {
		eager: true,
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	@JoinColumn()
	stockData: StockData;

	constructor(init: Partial<StockAsset>) {
		super();
		Object.assign(this, init);
	}
}

export const StockAssetMeta: EntityMeta<StockAsset> = {
	relations: ["asset", "orders"],
	data: ["uniqueId", "identity"]
}
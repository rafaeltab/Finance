import type { EntityMeta } from "@finance/lib-basic-types";
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, Relation } from "typeorm";
import { EnitityBase } from "../../../utils";
import { StockData } from "../../stockAggregate/StockData";
import { Asset } from "../Asset";
import { StockOrder } from "./StockOrder";

@Entity()
export class StockAsset extends EnitityBase {

	@OneToMany(() => StockOrder, (order) => order.stockAsset, {
	    eager: true
	})
	    orders?: Relation<StockOrder>[];

	@OneToOne(() => Asset, (asset) => asset.stockAsset, {
	    cascade: ["insert"],
	    onDelete: "CASCADE",
	})
	@JoinColumn()
	    asset?: Relation<Asset>;

	@ManyToOne(() => StockData, {
	    eager: true,
	    cascade: ["insert"],
	    onDelete: "CASCADE",
	})
	@JoinColumn()
	    stockData?: Relation<StockData>;

	constructor(init: Partial<StockAsset>) {
	    super();
	    Object.assign(this, init);
	}
}

export const StockAssetMeta: EntityMeta<StockAsset> = {
    relations: ["asset", "orders"],
    data: ["uniqueId", "identity"]
}
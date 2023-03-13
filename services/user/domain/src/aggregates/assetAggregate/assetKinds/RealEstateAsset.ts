import { Column, Entity, JoinColumn, OneToOne, Relation } from "typeorm";
import type { EntityMeta } from "@finance/lib-basic-types";
import { EnitityBase } from "../../../utils";
import { Asset } from "../Asset";

@Entity()
export class RealEstateAsset extends EnitityBase {
	/** Format:
	 *  <street name> <house number>, <city>, <state/province>, <country>
	 * 
	 *  Example:
	 * 
	 * 	Main Street 123, New York, NY, USA
	 */
	@Column()
	address?: string;

	@OneToOne(() => Asset, (asset) => asset.realEstateAsset, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	@JoinColumn()
	asset?: Relation<Asset>;
	
	constructor(init: Partial<RealEstateAsset>) {
		super();
		Object.assign(this, init);
	}
}

export const RealEstateAssetMeta: EntityMeta<RealEstateAsset> = {
	relations: ["asset"],
	data: ["address", "uniqueId", "identity"]
}
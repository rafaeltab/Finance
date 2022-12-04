import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { EnitityBase } from "../../../bases";
import { Asset } from "../Asset";
import { EntityMeta } from "@finance/libs-types";

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
	address: string;

	@OneToOne(() => Asset, (asset) => asset.realEstateAsset, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	@JoinColumn()
	asset: Asset;
	
	constructor(init: Partial<RealEstateAsset>) {
		super();
		Object.assign(this, init);
	}
}

export const RealEstateAssetMeta: EntityMeta<RealEstateAsset> = {
	relations: ["asset"],
	data: ["address", "uniqueId", "identity"]
}
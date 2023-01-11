import { Index, PrimaryGeneratedColumn, Column } from "typeorm";

export abstract class EnitityBase {
	/** Just a uuid used for FK */
	@PrimaryGeneratedColumn("uuid")
	uniqueId!: string;

	/** A human readable id */
	@Index({ unique: true })
	@Column()	
	identity!: string;
}

export function getKey(id: EntityKey) {
	if("uniqueId" in id) {
		return id.uniqueId;
	}

	return id.identity;
}

export type EntityKey = {
	uniqueId: string;
} | {
	identity: string;
}
import { Index, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

export abstract class EnitityBase {
	/** Just a uuid used for FK */
	@PrimaryGeneratedColumn("uuid")
	uniqueId: string;

	/** A human readable id */
	@Index({ unique: true })
	@Column()	
	identity: string;
}

export type EntityKey = {
	uniqueId: string;
} | {
	identity: string;
}
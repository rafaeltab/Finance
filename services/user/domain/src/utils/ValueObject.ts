import { PrimaryGeneratedColumn } from "typeorm";

export abstract class ValueObjectBase { 
	@PrimaryGeneratedColumn("uuid")
	uniqueId!: string;
}
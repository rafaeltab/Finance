import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { ActiveIncome } from "./ActiveIncome";
import { EnitityBase } from "../../utils/Entity";
import { User } from "../User";
import { EntityMeta } from "@finance/libs-types";

@Entity()
export class Job extends EnitityBase { 
	@Column()
	title: string;

	@OneToOne(() => ActiveIncome, {
		eager: true,
		cascade: ["insert", "remove"],
	})
	@JoinColumn()
	activeIncome: ActiveIncome;
	
	@ManyToOne(() => User, user => user.jobs, {
		onDelete: "CASCADE",
	})
	user: User;

	constructor(init: Partial<Job>) {
		super();
		Object.assign(this, init);
	}
}

export const JobMeta: EntityMeta<Job> = {
	relations: ["user", "activeIncome"],
	data: ["title", "uniqueId", "identity"]
}
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, Relation } from "typeorm";
import type { EntityMeta } from "@finance/lib-basic-types";
import { ActiveIncome } from "./ActiveIncome";
import { EnitityBase } from "../../utils/Entity";
import { User } from "../User";

@Entity()
export class Job extends EnitityBase { 
	@Column()
	    title?: string;

	@OneToOne(() => ActiveIncome, {
	    eager: true,
	    cascade: ["insert", "remove"],
	})
	@JoinColumn()
	    activeIncome?: Relation<ActiveIncome>;
	
	@ManyToOne(() => User, user => user.jobs, {
	    onDelete: "CASCADE",
	})
	    user?: Relation<User>;

	constructor(init: Partial<Job>) {
	    super();
	    Object.assign(this, init);
	}
}

export const JobMeta: EntityMeta<Job> = {
    relations: ["user", "activeIncome"],
    data: ["title", "uniqueId", "identity"]
}
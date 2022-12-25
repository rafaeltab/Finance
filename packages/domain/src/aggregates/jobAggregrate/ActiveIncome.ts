import { EntityMeta } from "@finance/libs-types";
import { Column, Entity, OneToOne } from "typeorm";
import { ValueObjectBase } from "../../utils/ValueObject";
import { Job } from "./job";

@Entity()
export class ActiveIncome extends ValueObjectBase { 
	@Column()
	monthlySalary: number;

	@OneToOne(() => Job, job => job.activeIncome, {
		onDelete: "CASCADE",
	})
	job: Job;

	constructor(init: Partial<ActiveIncome>) {
		super();
		Object.assign(this, init);
	}
}

export const ActiveIncomeMeta: EntityMeta<ActiveIncome> = {
	relations: [],
	data: ["monthlySalary", "uniqueId"],
}
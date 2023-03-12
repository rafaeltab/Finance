import type { EntityMeta } from "@finance/libs-types";
import { Column, Entity, OneToOne, Relation } from "typeorm";
import { ValueObjectBase } from "../../utils/ValueObject";
import { Job } from "./Job";
import { ColumnNumericTransformer } from "../../utils/numericTransformer";

@Entity()
export class ActiveIncome extends ValueObjectBase { 
	@Column({
		type: "numeric",
		scale: 3,
		transformer: new ColumnNumericTransformer()
	})
	monthlySalary?: number;

	@OneToOne(() => Job, job => job.activeIncome, {
		onDelete: "CASCADE",
	})
	job?: Relation<Job>;

	constructor(init: Partial<ActiveIncome>) {
		super();
		Object.assign(this, init);
	}
}

export const ActiveIncomeMeta: EntityMeta<ActiveIncome> = {
	relations: [],
	data: ["monthlySalary", "uniqueId"],
}
import type { EntityMeta } from "@finance/lib-basic-types";
import { Column, Entity, JoinColumn, OneToOne, Relation } from "typeorm";
import { ValueObjectBase } from "../../utils";
import { BankAccount } from "./BankAccount";
import { ColumnNumericTransformer } from "../../utils/numericTransformer";

@Entity()
export class Balance extends ValueObjectBase { 
	@Column({
		type: "numeric",
		scale: 3,
		transformer: new ColumnNumericTransformer()
	})
	amount?: number;

	@Column()
	currency?: string;

	@OneToOne(() => BankAccount, bankAccount => bankAccount.balance, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	@JoinColumn()
	bankAccount?: Relation<BankAccount>;

	constructor(init: Partial<Balance>) {
		super();
		Object.assign(this, init);
	}
}

export const BalanceMeta: EntityMeta<Balance> = {
	relations: ["bankAccount"],
	data: ["amount", "currency", "uniqueId"]
}
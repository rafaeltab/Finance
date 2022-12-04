import { EntityMeta } from "@finance/libs-types";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { ValueObjectBase } from "../../bases";
import { BankAccount } from "./BankAccount";

@Entity()
export class Balance extends ValueObjectBase { 
	@Column()
	amount: number;

	@Column()
	currency: string;

	@OneToOne(() => BankAccount, bankAccount => bankAccount.balance, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	@JoinColumn()
	bankAccount: BankAccount;

	constructor(init: Partial<Balance>) {
		super();
		Object.assign(this, init);
	}
}

export const BalanceMeta: EntityMeta<Balance> = {
	relations: ["bankAccount"],
	data: ["amount", "currency", "uniqueId"]
}
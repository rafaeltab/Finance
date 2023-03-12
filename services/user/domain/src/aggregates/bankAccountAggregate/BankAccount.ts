import type { EntityMeta } from "@finance/lib-basic-types";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, Relation } from "typeorm";
import { EnitityBase } from "../../utils";
import { User } from "../User";
import { Balance } from "./Balance";

@Entity()
export class BankAccount extends EnitityBase { 
	@Column()
	bank?: string;

	@OneToOne(() => Balance, balance => balance.bankAccount, {
		eager: true,
		cascade: ["insert"]
	})
	balance?: Relation<Balance>;

	@ManyToOne(() => User, user => user.bankAccounts, {
		cascade: ["insert"],
		onDelete: "CASCADE",
	})
	@JoinColumn()
	user?: Relation<User>;

	constructor(init: Partial<BankAccount>) {
		super();
		Object.assign(this, init);
	}
}

export const BankAccountMeta: EntityMeta<BankAccount> = {
	relations: ["user", "balance"],
	data: ["bank", "uniqueId", "identity"]
}
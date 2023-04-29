import type { EntityMeta } from "@finance/lib-basic-types"
import { Entity, Column, OneToMany, Relation } from "typeorm"
import { EnitityBase } from "../utils/Entity"
import { Asset } from "./assetAggregate/Asset"
import { AssetGroup } from "./AssetGroup"
import { BankAccount } from "./bankAccountAggregate"
import { Job } from "./jobAggregrate"

@Entity()
export class User extends EnitityBase {
	@Column()
	    firstName?: string

	@Column()
	    lastName?: string

	@Column()
	    dateOfBirth?: Date

	@OneToMany(() => Asset, asset => asset.user)
	    assets?: Relation<Asset>[]

	@OneToMany(() => AssetGroup, assetGroup => assetGroup.user)
	    assetGroups?: Relation<AssetGroup>[]

	@OneToMany(() => BankAccount, bankAccount => bankAccount.user)
	    bankAccounts?: Relation<BankAccount>[]

	@OneToMany(() => Job, job => job.user)
	    jobs?: Relation<Job>[]

	constructor(init: Partial<User>) {
	    super();
	    Object.assign(this, init);
	}
}

export const UserMeta: EntityMeta<User> = {
    relations: ["assets", "assetGroups", "bankAccounts", "jobs"],
    data: ["firstName", "lastName", "dateOfBirth", "uniqueId", "identity"]
}
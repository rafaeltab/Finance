import { EntityMeta } from "@finance/libs-types"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { EnitityBase } from "../bases/Entity"
import { Asset } from "./assetAggregate/Asset"
import { AssetGroup } from "./AssetGroup"
import BankAccount from "./bankAccountAggregate"
import Job from "./jobAggregrate"

@Entity()
export class User extends EnitityBase {
    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
	age: number
	
	@OneToMany(() => Asset, asset => asset.user)
	assets: Asset[]
	
	@OneToMany(() => AssetGroup, assetGroup => assetGroup.user)
	assetGroups: AssetGroup[]

	@OneToMany(() => BankAccount, bankAccount => bankAccount.user)
	bankAccounts: BankAccount[]
	
	@OneToMany(() => Job, job => job.user)
	jobs: Job[]

	constructor(init: Partial<User>) {
		super();
		Object.assign(this, init);
	}
}

export const UserMeta: EntityMeta<User> = {
	relations: ["assets", "assetGroups", "bankAccounts", "jobs"],
	data: ["firstName", "lastName", "age", "uniqueId", "identity"]
}
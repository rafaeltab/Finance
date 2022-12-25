import { InjectionToken } from "tsyringe";
import BankAccount from "../aggregates/bankAccountAggregate";
import { EntityKey } from "../utils";

export const bankAccountFactory: InjectionToken = "IBankAccountFactory";

export interface IBankAccountFactory {
	addBankAccountToUser(user: EntityKey, bank: string, balance: number, currency: string): Promise<BankAccount>;
}
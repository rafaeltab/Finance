import type { InjectionToken } from "tsyringe";
import type { User } from "../aggregates/User";

export const userFactoryToken: InjectionToken = "IUserFactory";

export interface IUserFactory {
	createUser(identity: string, firstName: string, lastName: string, dateOfBirth: Date): Promise<User>;
}
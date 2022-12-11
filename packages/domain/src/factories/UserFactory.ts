import { InjectionToken } from "tsyringe";
import { User } from "../aggregates/User";

export const userFactory: InjectionToken = "IUserFactory";

export interface IUserFactory {
	createUser(identity: string, firstName: string, lastName: string, dateOfBirth: Date): Promise<User>;
}
import { Module, ModuleMetadata } from "@nestjs/common";
import { ApplicationModule } from "../../../external/ApplicationModule";
import { UserController } from "./user.controller";
import { JobController } from "./job/job.controller";
import { BankAccountController } from "./bankAccount/bankAccount.controller";

export const UserModuleMetadata = {
	imports: [ApplicationModule],
	controllers: [UserController, JobController, BankAccountController],
} satisfies ModuleMetadata;

@Module(UserModuleMetadata)
export class UserModule { }
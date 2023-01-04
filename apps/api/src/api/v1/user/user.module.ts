import { Module, ModuleMetadata } from "@nestjs/common";
import { ApplicationModule } from "../../../external/ApplicationModule";
import { UserController } from "./user.controller";

export const UserModuleMetadata = {
	imports: [ApplicationModule],
	controllers: [UserController],
} satisfies ModuleMetadata;

@Module(UserModuleMetadata)
export class UserModule { }
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport/dist";
import { JwtStrategy } from "./jwt.strategy";

@Module({
	imports: [PassportModule.register({ defaultStrategy: "jwt" })],
	providers: [
		{
			provide: JwtStrategy,
			useFactory: async (configService: ConfigService) => new JwtStrategy(configService),
			inject: [ConfigService]
		}
	],
	exports: [PassportModule],
})
export class AuthzModule {

}
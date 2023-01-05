import { MiddlewareConsumer, Module, ModuleMetadata, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ApplicationModule } from "./external/ApplicationModule";
import { StockModule } from "./api/v1/stock/stock.module";
import { UserModule } from "./api/v1/user/user.module";
import { AppLoggerMiddleware } from "./app.logger";

export const AppModuleMetadata = {
	imports: [ApplicationModule, StockModule, UserModule],
	controllers: [AppController],
	providers: [AppService],
} satisfies ModuleMetadata;


@Module(AppModuleMetadata)
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}
}

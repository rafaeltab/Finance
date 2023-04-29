import { MiddlewareConsumer, Module, ModuleMetadata, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ApplicationModule } from "./external/ApplicationModule";
import { StockModule } from "./api/v1/stock/stock.module";
import { UserModule } from "./api/v1/user/user.module";
import { AppLoggerMiddleware } from "./app.logger";
import configuration from "./configuration";
import { AuthzModule } from "./authz/authz.module";

const isDevelopment = process.env["NODE_ENV"] === "development";
const environment = isDevelopment ? "development" : "production";


export const AppModuleMetadata = {
    imports: [
        ConfigModule.forRoot({
            envFilePath: [
                ".env",
                `.env.${environment}`
            ],
            load: [configuration],
            isGlobal: true,
        }),
        ApplicationModule,
        StockModule,
        UserModule,	
        AuthzModule
    ],
    controllers: [],
    providers: [],
} satisfies ModuleMetadata;


@Module(AppModuleMetadata)
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}

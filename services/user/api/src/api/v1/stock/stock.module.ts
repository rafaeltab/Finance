import { Module, ModuleMetadata } from "@nestjs/common";
import { ApplicationModule } from "../../../external/ApplicationModule";
import { StockController } from "./stock.controller";

export const StockModuleMetadata = {
    imports: [ApplicationModule],
    controllers: [StockController],
} satisfies ModuleMetadata;

@Module(StockModuleMetadata)
export class StockModule { }
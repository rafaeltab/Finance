import { Module, ModuleMetadata } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationModule } from './external/ApplicationModule';
import { StockModule } from './api/v1/stock/stock.module';

export const AppModuleMetadata = {
	imports: [ApplicationModule, StockModule],
	controllers: [AppController],
	providers: [AppService],
} satisfies ModuleMetadata;


@Module(AppModuleMetadata)
export class AppModule { }

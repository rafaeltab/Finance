import { Module, OnModuleDestroy, Provider } from "@nestjs/common";
import { Mediator } from "@finance/lib-mediator";
import { ApplicationMediatorModule } from "@finance/svc-user-application";

var mediator = new Mediator();

const MediatorProvider: Provider = {
	provide: Mediator,
	useFactory: async () => {
		await mediator.register(ApplicationMediatorModule)
		return mediator;
	}
}

@Module({
	imports: [],
	controllers: [],
	providers: [MediatorProvider],
	exports: [MediatorProvider],

})
export class ApplicationModule implements OnModuleDestroy {
	async onModuleDestroy() {
		await mediator.dispose();
	}
}
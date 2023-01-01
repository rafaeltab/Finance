import { Module, Provider } from "@nestjs/common";
import { Mediator } from '@finance/libs-types';
import { ApplicationMediatorModule } from '@finance/application';

var mediator = new Mediator();
await mediator.register(ApplicationMediatorModule)

const MediatorProvider: Provider = {
	provide: Mediator,
	useValue: mediator
}

@Module({
	imports: [],
	controllers: [],
	providers: [MediatorProvider],
	exports: [MediatorProvider]

})
export class ApplicationModule { }
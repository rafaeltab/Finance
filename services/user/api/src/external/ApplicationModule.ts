import { Module, OnModuleDestroy, Provider } from "@nestjs/common";
import { Mediator } from "@finance/lib-mediator";
import { ApplicationMediatorModule } from "@finance/svc-user-application";
import { provider } from "./ConfigurationModule";
import { databaseConfigurationToken, DatabaseConfiguration } from "@finance/svc-user-infra-postgres";
import type { ConfigSectionProvider } from "@finance/lib-config";

const mediator = new Mediator();
mediator.depContainer.register("ConfigurationProvider", {
    useValue: provider
});
mediator.depContainer.register<ConfigSectionProvider<DatabaseConfiguration>>(databaseConfigurationToken, {
    useValue: provider.createSection("database")
})


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

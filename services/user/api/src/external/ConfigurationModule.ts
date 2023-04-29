
import { Module, OnModuleDestroy, Provider } from "@nestjs/common";
import { ConfigurationBuilder, ConfigurationProvider, ObjectConfigurationSource } from "@finance/lib-config";
import { z } from "zod";

const configSchema = z.object({
    auth: z.object({
        auth0: z.object({
            issuer: z.string(),
            audience: z.string()
        })
    }),
    database: z.object({
        
    })
})

const config = new ConfigurationBuilder(configSchema)
    .addContext(builder => builder
        .addEnvironmentVariables()
        .addDotEnv()
        .build())
    .addObjectSource(() => new ObjectConfigurationSource<typeof configSchema>({
        auth: {
            auth0: {
                issuer: "{AUTH0_ISSUER_URL}",
                audience: "{AUTH0_AUDIENCE}"
            }
        },
        database: {
            
        }
    }))
    .useReplaceForContext("{")
    .build()

const provider = new ConfigurationProvider(config, 0);

const configProvider: Provider = {
    provide: ConfigurationProvider,
    useValue: provider
}

@Module({
    imports: [],
    controllers: [],
    providers: [configProvider],
    exports: [configProvider],
})
export class ConfigurationModuleModule implements OnModuleDestroy {
    onModuleDestroy() {
        provider.dispose();
    }
}

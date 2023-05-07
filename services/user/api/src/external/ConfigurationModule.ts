import { Module, OnModuleDestroy, Provider } from "@nestjs/common";
import { ConfigFileType, ConfigurationBuilder, ConfigurationProvider, FileConfigurationSource, ObjectConfigurationSource } from "@finance/lib-config";
import { z } from "zod";
import type { DatabaseConfiguration } from "@finance/svc-user-infra-postgres";

const configSchema = z.object({
    auth: z.object({
        auth0: z.object({
            issuer: z.string(),
            audience: z.string()
        })
    }),
    database: z.object({
        host: z.string(),
        port: z.string(),
        password: z.string(),
        username: z.string(),
        database: z.string(),
    }) satisfies z.ZodType<DatabaseConfiguration>
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
        }
    }))
    .addFileSource(() => new FileConfigurationSource("appsettings.json", ConfigFileType.Json))
    .useReplaceForContext("{")
    .build()

export const provider = new ConfigurationProvider(config, 0);
await provider.configPromise;
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

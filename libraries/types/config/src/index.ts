// import { z } from "zod";
//
// const configSchema = z.object({
//     database: z.object({
//         host: z.string(),
//         port: z.number(),
//         username: z.string(),
//         password: z.string()
//     })
// })
//
// const config = new ConfigurationBuilder(configSchema)
//     .addContext((options) => options
//         .addEnvironmentVariables()
//         .build())
//     .addObjectSource(() => new ObjectConfigurationSource({
//         database: {
//             host: "localhost",
//             port: 4321,
//             username: "John",
//             password: "Doe"
//         }
//     }))
//     .build();
// const provider = new ConfigurationProvider(config, 1000);
// await provider.configPromise;
//
// console.log(provider.config.database.username);
//

export * from "./configuration";
export * from "./configProvider";
export * from "./configurationBuilder";
export * from "./configurationContextBuilder";
export * from "./sources";

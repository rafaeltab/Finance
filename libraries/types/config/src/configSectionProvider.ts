import type { z } from "zod";
import type { ConfigurationProvider } from "./configProvider";

export class ConfigurationSectionProvider<
        TConfig,
        TSection extends keyof z.infer<TSchema> & string,
        TSchema extends z.ZodObject<{[k in TSection]: z.ZodType<TConfig>}>
    > {

    constructor(private configProvider: ConfigurationProvider<TSchema>, private section: TSection){}

    get config(): TConfig{
        return this.configProvider.config[this.section];
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConfigSectionProvider<TConfig> = ConfigurationSectionProvider<TConfig, any, any>;

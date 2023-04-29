import type { z, ZodObject, ZodRawShape } from "zod";
import type { IConfigurationSource } from "./configurationSource";

export class ObjectConfigurationSource<TConfig extends ZodObject<ZodRawShape>> implements IConfigurationSource {
    constructor(private config: Partial<z.infer<TConfig>>) { }

    async getConfiguration(): Promise<Record<string, unknown>> {
        return this.config;
    }
}


import type { z, ZodObject, ZodRawShape } from "zod";
import type { IConfigurationSource } from "./sources/configurationSource";
import { ReplaceRegexes, replaceUnknown } from "./util/regexes";

export class Configuration<TConfig extends ZodObject<ZodRawShape>> {
    constructor(private zodSchema: TConfig,
		private sources: IConfigurationSource[],
		private context: Record<string, string>,
		private regexes: ReplaceRegexes | null) {
    }

    async config(): Promise<z.infer<TConfig>> {
        const config: Partial<z.infer<TConfig>> = {};
        const sourcePromises: Promise<Partial<z.infer<TConfig>>>[] = this.sources.map(x => x.getConfiguration(this.context));

        const sourceResults = await Promise.all(sourcePromises);

        for (const source of sourceResults) {

            Object.assign(config, source);
        }

        let replacedConfig: unknown = {}

        if (this.regexes == null) {
            replacedConfig = config;
        } else {
            replacedConfig = replaceUnknown(config, this.context, this.regexes);
        }

        return this.zodSchema.parse(replacedConfig);
    }
}


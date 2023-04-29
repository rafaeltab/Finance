import type { ZodObject, ZodRawShape } from "zod";
import { Configuration } from "./configuration";
import { ConfigurationContextBuilder } from "./configurationContextBuilder";
import type { IConfigurationSource } from "./sources/configurationSource";
import type { FileConfigurationSource } from "./sources/fileConfigurationSource";
import type { ObjectConfigurationSource } from "./sources/objectConfigurationSource";
import type { Bracket } from "./util/brackets";
import { createRegexes } from "./util/regexes";

export class ConfigurationBuilder<TConfig extends ZodObject<ZodRawShape>> {

    private context: Record<string, string> = {};

    private sources: IConfigurationSource[] = [];

    private replaceBracket: Bracket | null = null;


    constructor(private zodSchema: TConfig) { }

    addContext(options: (builder: ConfigurationContextBuilder) => Record<string, string>) {
        const contextBuilder = new ConfigurationContextBuilder();
        this.context = Object.assign(this.context, options(contextBuilder));
        return this;
    }

    /** If the specified bracket occurs twice in a row it is seen as one bracket, but not used for a replace */
    useReplaceForContext(replaceContextBracket: Bracket) {
        this.replaceBracket = replaceContextBracket;
        return this;
    }

    private addSource(source: IConfigurationSource): this {
        this.sources.push(source);
        return this;
    }

    addFileSource(options: () => FileConfigurationSource): this {
        return this.addSource(options());
    }

    addObjectSource(options: () => ObjectConfigurationSource<TConfig>): this {
        return this.addSource(options());
    }

    build(): Configuration<TConfig> {
        return new Configuration(
            this.zodSchema,
            this.sources,
            this.context,
            this.replaceBracket === null ? null : createRegexes(this.replaceBracket)
        );
    }
}

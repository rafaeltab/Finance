import { join, dirname } from "path";
import { DotenvParseOutput, parse } from "dotenv";
import { fileURLToPath } from "url";

export class ConfigurationContextBuilder {
    private conceptualContext: Record<string, string> = {};

    addDotEnv(environment?: string): this {
        const currentJsFile = fileURLToPath(import.meta.url);
        const dir = dirname(currentJsFile);

        const filename = `${environment ? `.{environment}` : ""}.env`;
        const content: DotenvParseOutput = parse(join(dir, filename));

        this.conceptualContext = Object.assign(this.conceptualContext, content);
        return this;
    }

    addEnvironmentVariables(): this {
        this.conceptualContext = Object.assign(this.conceptualContext, process.env);
        return this;
    }

    addValue(key: string, value: string): this {
        this.conceptualContext[key] = value;
        return this;
    }

    build(): Record<string, string> {
        return this.conceptualContext;
    }
}


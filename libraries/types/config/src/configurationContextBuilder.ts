import { join } from "path";
import { DotenvParseOutput, parse } from "dotenv";

export class ConfigurationContextBuilder {
    private conceptualContext: Record<string, string> = {};

    addDotEnv(environment?: string): this {
        const filename = `${environment ? `.{environment}` : ""}.env`;
        const content: DotenvParseOutput = parse(join(__dirname, filename));

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


import { parse as yamlParse } from "yaml";
import { parse as tomlParse } from "toml";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import type { IConfigurationSource } from "./configurationSource";

export enum ConfigFileType {
    Json,
    Yaml,
    Toml,
}

export class FileConfigurationSource implements IConfigurationSource {
    constructor(private fileName: string, private fileType: ConfigFileType) { }

    async getConfiguration(): Promise<Record<string, unknown>> {
        if (!existsSync(this.fileName)) {
            throw new Error(`Configuration file not found ${this.fileName}`);
        }
        const fileContent = await readFile(this.fileName);
        let objectContent: unknown;
        switch (this.fileType) {
        case ConfigFileType.Json:
            objectContent = JSON.parse(fileContent.toString());
            break;
        case ConfigFileType.Yaml:
            objectContent = yamlParse(fileContent.toString());
            break;
        case ConfigFileType.Toml:
            objectContent = tomlParse(fileContent.toString());
            break;
        default:
            throw new Error("Unexpected enum value");
        }

        if (typeof objectContent !== "object" || objectContent === null || Array.isArray(objectContent)) {
            throw new Error(`File did not contain an object in the format of ${this.fileType} `);
        }

        return objectContent as Record<string, unknown>;
    }
}


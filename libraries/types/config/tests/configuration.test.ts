import { z } from "zod";
import { Configuration } from "#src/configuration";
import { IConfigurationSource, ObjectConfigurationSource } from "#src/sources";
import { createRegexes } from "#src/util/regexes";

describe("configuration", () => {
    it("Given a valid setup when config is called then it should return the correct config", async () => {
        const configSchema = z.object({
            cool: z.object({
                awesome: z.string()
            })
        });

        const sources: IConfigurationSource[] = [
            new ObjectConfigurationSource<typeof configSchema>({
                cool: {
                    awesome: "{superCool}"
                }
            })
        ];

        const context = {
            "superCool": "superDuperCool"
        } satisfies Record<string, string>;

        const config = new Configuration(configSchema, sources, context, createRegexes("{"));

        const result = await config.config();

        expect(result).toEqual({
            cool: {
                awesome: "superDuperCool"
            }
        })
    });
});

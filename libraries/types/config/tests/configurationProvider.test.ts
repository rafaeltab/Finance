import { fromPartial } from "@total-typescript/shoehorn";
import { z } from "zod";
import { ConfigurationProvider } from "#src/configProvider";

const testSchema = z.object({
    config: z.string()
})

describe("ConfigProvider", () => {
    let sut: ConfigurationProvider<typeof testSchema>;

    afterEach(() => {
        sut.dispose();
    })

    it("Given correct configuration when config promise is awaited then config should return a value", async () => {
        const configStub = {
            config: async() => ({
                config: "yes"
            }) 
        }

        sut = new ConfigurationProvider<typeof testSchema>(fromPartial(configStub), 100000);

        await sut.configPromise;

        const result = sut.config;

        expect(result).toEqual({
            config: "yes"
        })
    });    

    it("Given correct configuration and a listener when updateConfig is called then the listener should be called with the resulting config", async () => {
        const configStub = {
            config: async() => ({
                config: "yes"
            }) 
        }

        sut = new ConfigurationProvider<typeof testSchema>(fromPartial(configStub), 100000);

        await sut.configPromise;

        let result: unknown;

        sut.listen((config) => {
            result = config
        });

        await sut.updateConfig();

        expect(result).toEqual({
            config: "yes"
        })
    });

    it("Given correct configuration when createSection is called then it should return a section that returns only part of the configuration", async () => {
        const configStub = {
            config: async() => ({
                config: "yes"
            }) 
        }

        sut = new ConfigurationProvider<typeof testSchema>(fromPartial(configStub), 100000);

        await sut.configPromise;

        const section = sut.createSection("config");

        expect(section.config).toEqual("yes")
    });
})

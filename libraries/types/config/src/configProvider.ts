import type { z, ZodObject, ZodRawShape } from "zod";
import { v4 as uuidV4 } from "uuid";
import type { Configuration } from "./configuration";

type ConfigurationListener<TConfig extends ZodObject<ZodRawShape>> = (config: z.infer<TConfig>) => void;

export class ConfigurationProvider<TConfig extends ZodObject<ZodRawShape>> {
    private activeConfiguration?: z.infer<TConfig>;

    private intervalIdentifier?: NodeJS.Timer;


    public configPromise: Promise<void>;


    constructor(private configuration: Configuration<TConfig>, refreshRateMs: number) {
        this.configPromise = this.updateConfig();
        
        if(refreshRateMs !== 0){
            this.intervalIdentifier = setInterval(this.updateConfig.bind(this), refreshRateMs);
        }
    }

    async updateConfig(): Promise<void> {
        this.activeConfiguration = await this.configuration.config();

        for(const listener of this.listeners.values()){
            listener(this.activeConfiguration);
        }
    }

    get config(){
        if(this.activeConfiguration === undefined){
            throw new Error("Config not yet initialized. Make sure to await ConfigurationProvider.configPromise");
        }

        return this.activeConfiguration;
    }
   
    dispose(){
        if(this.intervalIdentifier !== undefined){
            clearInterval(this.intervalIdentifier);
        }
    }

    private listeners: Map<string, ConfigurationListener<TConfig>> = new Map();

    listen(listener: ConfigurationListener<TConfig>){
        const id = uuidV4(); 
        this.listeners.set(id, listener);

        return id;
    }
}


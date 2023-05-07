import "reflect-metadata"
import { DataSource } from "typeorm"
import { entities } from "@finance/svc-user-domain";
import { inject, injectable, InjectionToken } from "tsyringe";
import type { ConfigSectionProvider } from "@finance/lib-config";
import * as migrations from "./migrations/index";

export type DatabaseConfiguration = {
    host: string,
    port: string,
    username: string,
    password: string,
    database: string
}

export const databaseConfigurationToken: InjectionToken = "DatabaseConfig";

@injectable()
export class InfrastructureDataSource extends DataSource {
    constructor(@inject(databaseConfigurationToken) config: ConfigSectionProvider<DatabaseConfiguration>) {
        super({
            type: "postgres",
            host: config.config.host,
            port: parseInt(config.config.port, 10),
            username: config.config.username,
            password: config.config.password,
            database: config.config.database,
            synchronize: false,
            logging: false,
            entities,
            migrations,
            subscribers: [],
        });

        InfrastructureDataSource.instances.push(this);
    }

    override async initialize(): Promise<this> {
        console.log("Database initializing.")

        return super.initialize();
    }

    static instances: InfrastructureDataSource[] = []

    static async destroy() {
        await Promise.all(this.instances.map(x => x.destroy()));
    }
}

export const dataSourceToken: InjectionToken = "DataSource";

export const DefaultAppSource = new InfrastructureDataSource({
    config: {
        host: "localhost",
        port: "5432",
        password: "finance",
        database: "finance",
        username: "finance"
    }
} as ConfigSectionProvider<DatabaseConfiguration>);


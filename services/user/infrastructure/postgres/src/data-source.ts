import "reflect-metadata"
import { DataSource } from "typeorm"
import { entities } from "@finance/svc-user-domain";
import type { InjectionToken } from "tsyringe";
import { z } from "zod";
import * as migrations from "./migrations/index";


export const configSchema = z.object({
    host: z.string(),
    port: z.string(),
    username: z.string(),
    password: z.string(),
    database: z.string(),
})

export class InfrastructureDataSource extends DataSource {
    constructor(){
        super({
	    type: "postgres",
	    host: "localhost",
	    port: 5432,
	    username: "finance",
	    password: "finance",
	    database: "finance",
	    synchronize: false,
	    logging: false,
	    entities,
	    migrations,
	    subscribers: [],
        });
    }
}

export const dataSourceToken: InjectionToken = "DataSource";
export const AppDataSource = new InfrastructureDataSource();


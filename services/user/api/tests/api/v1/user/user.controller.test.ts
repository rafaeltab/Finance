import type { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import type { Request, Response } from "express";
import request from "supertest";
import { cors, errorsFilter, validationPipe } from "#src/globalRegistrations";
import { UserModuleMetadata } from "../../../../src/api/v1/user/user.module";

describe('UserController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule(UserModuleMetadata)
            .compile()

        app = moduleFixture.createNestApplication();
		
        validationPipe(app);
        errorsFilter(app);
        cors(app);

        app.use((req: Request, _: Response, next: unknown) => { 
            req.user = {
                scope: "admin",
                sub: "banana"
            }
            if (next instanceof Function) { 
                next();
            } else {
                throw new Error();
            }
        })
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    })

    it('/api/v1/user (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/v1/user')
            .expect(200);

        const {body} = response;
		
        expect(body.success).toBe(true);
        expect(body.data).toBeDefined();
        expect(body.data.data).toBeDefined();
        expect(body.data.page).toBeDefined();
        expect(body.data.page.count).toBeDefined();
        expect(body.data.page.offset).toBeDefined();
        expect(body.data.page.total).toBeDefined();
    });

    it('/api/v1/user/:identity (GET)', async () => {
        await request(app.getHttpServer())
            .get('/api/v1/user/banana')
            .expect(404);
    });
});

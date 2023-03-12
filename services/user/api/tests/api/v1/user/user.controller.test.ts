import { Test, TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { UserModuleMetadata } from "../../../../src/api/v1/user/user.module";

describe('UserController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule(UserModuleMetadata).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	})

	it('/api/v1/user (GET)', async () => {
		const response = await request(app.getHttpServer())
			.get('/api/v1/user')
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.data).toBeDefined();
		expect(response.body.data.isEmpty).toBeDefined();
		expect(response.body.data.data).toBeDefined();
		expect(response.body.data.page).toBeDefined();
		expect(response.body.data.page.count).toBeDefined();
		expect(response.body.data.page.offset).toBeDefined();
		expect(response.body.data.page.total).toBeDefined();
	});

	it('/api/v1/user/:identity (GET)', async () => {
		await request(app.getHttpServer())
			.get('/api/v1/user/banana')
			.expect(404);
	});
});

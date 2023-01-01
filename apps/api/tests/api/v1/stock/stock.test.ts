import { Test, TestingModule } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { StockModuleMetadata } from '../../../../src/api/v1/stock/stock.module';

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule(StockModuleMetadata).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/api/v1/stock (GET)', async () => {
		const response = await request(app.getHttpServer())
			.get('/api/v1/stock')
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

	it('/api/v1/stock/search (GET)', async () => {
		const response = await request(app.getHttpServer())
			.get('/api/v1/stock/search?symbol=GOOG')
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

	it('/api/v1/stock/:identity (GET)',async () => {
		return request(app.getHttpServer())
			.get('/api/v1/stock/stockData-CS-NASDAQ-GOOG')
			.expect(404);

		// expect(response.body.success).toBe(true);
		// expect(response.body.data).toBeDefined();
		// expect(response.body.data.isEmpty).toBeDefined();
		// expect(response.body.data.data).toBeDefined();
		// expect(response.body.data.page).toBeDefined();
		// expect(response.body.data.page.count).toBeDefined();
		// expect(response.body.data.page.offset).toBeDefined();
		// expect(response.body.data.page.total).toBeDefined();
	});
});

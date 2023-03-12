import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { createSwaggerDocument, setupSwagger } from "./swagger";
import { writeFileSync } from "fs";
import { FinanceProgrammerErrorExceptionFilter, FinanceUserErrorExceptionFilter } from "@finance/errors-nest";
import { AuthzGuard } from "./authz/authz.guard";

async function bootstrap() {
	const app = await createApp();

	setupSwagger(app);

	await app.listen(3000);
}

async function createApp() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({
		transform: true,
		forbidUnknownValues: false,
	}));
	app.useGlobalGuards(new AuthzGuard());
	app.useGlobalFilters(new FinanceUserErrorExceptionFilter(app.getHttpAdapter()), new FinanceProgrammerErrorExceptionFilter(app.getHttpAdapter()));
	app.enableCors({
		origin: /http:\/\/localhost:(3000|3001)/
	});
	return app;
}

async function generateDefinition() {
	const app = await createApp();
	const document = createSwaggerDocument(app);

	writeFileSync("swagger.json", JSON.stringify(document, null, 4));
}

if (process.argv.includes("--generate-swagger")) {
	generateDefinition();
} else {
	bootstrap();
}

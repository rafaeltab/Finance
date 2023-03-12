import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication) { 
	const document = createSwaggerDocument(app);
	SwaggerModule.setup("api/docs", app, document, {
		swaggerOptions: {
			initOAuth: {
				clientId: process.env["AUTH0_CLIENTID"],
			},
		}
	});
}

export function createSwaggerDocument(app: INestApplication) { 
	const config = new DocumentBuilder()
		.setTitle("Finance API")
		.setDescription("Finance API description")
		.setVersion("1.0")
		.addTag("finance")
		.addOAuth2({
			type: "oauth2",
			in: "header",
			name: "Authorization",
			flows: {
				implicit: {
					scopes: {
						"openid": "openid",
						"profile": "profile",
						"email": "email"
					},
					authorizationUrl: "https://" + process.env["AUTH0_DOMAIN"] + "/authorize",
				},
			},
			bearerFormat: "JWT",
		})
		.build();
	
	return SwaggerModule.createDocument(app, config);
}

import type { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";

export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		const issuer = configService.getOrThrow<string>("auth.auth0.issuer");
		const audience = configService.getOrThrow<string>("auth.auth0.audience");

		super({
			secretOrKeyProvider: passportJwtSecret({
				cache: true,
				rateLimit: true,
				jwksRequestsPerMinute: 5,
				jwksUri: `${issuer}.well-known/jwks.json`,
			}),

			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			audience: audience,
			issuer: issuer,
			algorithms: ['RS256']
		} satisfies StrategyOptions);
	}

	validate(payload: unknown): unknown {
		return payload;
	}
}
import type { CanActivate, ExecutionContext } from "@nestjs/common";
import type { Observable } from "rxjs";

type Scopes = {
	or: string[]
} | {
	and: string[]
}
function isAnd(scopes: Scopes): scopes is { and: string[] } {
	return "and" in scopes;
}

function isOr(scopes: Scopes): scopes is { or: string[] } {
	return "or" in scopes;
}

function validateScopes(scopes: Scopes, presentScopes: string[]): boolean {
	if (isOr(scopes)) {
		return scopes.or.some(scope => presentScopes.includes(scope));
	} if (isAnd(scopes)) {
		return scopes.and.every(scope => presentScopes.includes(scope));
	}
	return false;

}


export class ScopeGuard implements CanActivate {
	private scopes: Scopes;

	private userIdentityParam: string | null;

	constructor(scopes: Scopes | string[], userIdentityParam: string | null = null) {
		let actualScopes: Scopes;
		if (Array.isArray(scopes)) {
			actualScopes = { and: scopes };
		} else { 
			actualScopes = scopes;
		}
		this.scopes = actualScopes;
		this.userIdentityParam = userIdentityParam;
	}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest();
		let presentScopes: string[] = [];

		if (req.user && req.user.scope) {
			presentScopes = req.user.scope.split(" ");
		} 

		if (this.userIdentityParam !== null) { 
			const userParam = req.params[this.userIdentityParam];
			if (userParam !== req.user.sub || !req.user?.scope) { 
				return false;
			}
		}

		return validateScopes(this.scopes, presentScopes);
	}
}


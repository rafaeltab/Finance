import type { CanActivate, ExecutionContext } from "@nestjs/common";
import type { Observable } from "rxjs";

type Scopes = {
	or: string[]
} | {
	and: string[]
}

export class ScopeGuard implements CanActivate {
	private _scopes: Scopes;
	private _userIdentityParam: string | null;

	constructor(scopes: Scopes | string[], userIdentityParam: string | null = null) {
		if (Array.isArray(scopes)) { 
			scopes = { and: scopes };
		}
		this._scopes = scopes;
		this._userIdentityParam = userIdentityParam;
	}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest();
		let presentScopes: string[] = [];

		if (req.user && req.user.scope) {
			presentScopes = req.user.scope.split(" ");
		} 

		if (this._userIdentityParam !== null) { 
			const userParam = req.params[this._userIdentityParam];
			if (userParam !== req.user.sub || !req.user?.scope) { 
				return false;
			}
		}

		return validateScopes(this._scopes, presentScopes);
	}
}

function validateScopes(scopes: Scopes, presentScopes: string[]): boolean {
	if (isOr(scopes)) {
		return scopes.or.some(scope => presentScopes.includes(scope));
	} else if (isAnd(scopes)) {
		return scopes.and.every(scope => presentScopes.includes(scope));
	} else {
		return false;
	}
}

function isOr(scopes: Scopes): scopes is { or: string[] } {
	return "or" in scopes;
}

function isAnd(scopes: Scopes): scopes is { and: string[] } {
	return "and" in scopes;
}
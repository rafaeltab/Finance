"use client";

import { Auth0Provider, useAuth0, User } from "@auth0/auth0-react";
import "react";

function getAuth0Options() {
	const clientId = process.env["NEXT_PUBLIC_AUTH0_CLIENTID"] ?? "";
	const domain = process.env["NEXT_PUBLIC_AUTH0_DOMAIN"] ?? "";

	if (clientId == "" || domain == "") throw new Error("Missing auth0 config");

	return [clientId, domain] as const;
}

export function AuthenticationProvider({ children }: React.PropsWithChildren) {
	const [clientId, domain] = getAuth0Options();
	
	return (
		<Auth0Provider
			domain={domain}
			clientId={clientId}
			authorizationParams={{
				redirect_uri: process.env["NEXT_PUBLIC_AUTH0_ORIGIN"],
				audience: process.env["NEXT_PUBLIC_AUTH0_AUDIENCE"]
			}}
			cacheLocation="localstorage"
			
		>
			{children}
		</Auth0Provider>
	);
}

export function useUser(): User | null {
	const { user } = useAuth0();

	if (user == undefined) return null;

	return user;
}

export function useLogout(): (() => void) | null {
	const { logout } = useAuth0();

	if (logout == undefined) return null;

	return () => {
		logout({
			logoutParams: {
				returnTo: process.env["NEXT_PUBLIC_AUTH0_ORIGIN"]
			}
		})
	};
}
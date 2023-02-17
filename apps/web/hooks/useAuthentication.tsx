"use client";

import { Auth0Provider, useAuth0, User } from "@auth0/auth0-react";
import "react";
import type { AxiosError } from "axios";

function getAuth0Options() {
	const clientId = process.env["NEXT_PUBLIC_AUTH0_CLIENTID"] ?? "";
	const domain = process.env["NEXT_PUBLIC_AUTH0_DOMAIN"] ?? "";

	if (clientId == "" || domain == "") throw new Error("Missing auth0 config");

	return [clientId, domain] as const;
}

export function catchAuth(reason: any) {
	if (isUserNotFoundError(reason)) { 
		window.location.replace("/user-create");
	}
}

export function isUserNotFoundError(error: any) {
	if (error instanceof Error) {
		if ((error as any)["isAxiosError"] === true) {
			const axiosError: AxiosError = error as any as AxiosError;
			if (axiosError.response?.status == 404 && axiosError.config.url?.includes("/user") && axiosError.config.method == "get") {
				return true;
			}
		}
	}
	
	throw error;
}

export function AuthenticationProvider({ children }: React.PropsWithChildren) {
	const [clientId, domain] = getAuth0Options();

	return (
		<Auth0Provider
			domain={domain}
			clientId={clientId}
			authorizationParams={{
				redirect_uri: process.env["NEXT_PUBLIC_AUTH0_ORIGIN"],
				audience: process.env["NEXT_PUBLIC_AUTH0_AUDIENCE"],
				scope: "openid profile email admin"
			}}
			cacheLocation="localstorage"
		>
			{children}
		</Auth0Provider>
	);
}

export type SubRequired = {
	sub: string;
}
export function useUser(): User & SubRequired | null;
export function useUser<B extends boolean>(optional: B): (B extends true ? User & SubRequired | null : User & SubRequired);
export function useUser(optional?: boolean): User & SubRequired | null {
	const { user } = useAuth0();

	if (user == undefined) { 
		if (optional == true) return null;
		throw new Error("User is not logged in");
	}

	if(user.sub == undefined) throw new Error("User has no subject");

	return user as User & SubRequired;
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
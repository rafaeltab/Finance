import { createAuth0Client } from "@auth0/auth0-spa-js";
import React, { createContext, useContext, useEffect, useState } from "react";

type Authentication = {
	authenticated: false,
	login: (state: Authentication, setState: React.Dispatch<React.SetStateAction<Authentication>>) => void;
} | {
	authenticated: true;
	user: User;
	logout: () => void;
}

export type User = {
	name: string;
	picture: string;
}

const defaultValue: Authentication = {
	authenticated: false,
	login: login
}

const AuthenticationContext = createContext<Authentication>(defaultValue);

function getAuth0Options() {
	const clientId = process.env["NEXT_PUBLIC_AUTH0_CLIENTID"] ?? "";
	const domain = process.env["NEXT_PUBLIC_AUTH0_DOMAIN"] ?? "";

	if (clientId == "" || domain == "") throw new Error("Missing auth0 config");

	return [clientId, domain] as const;
}

function login(state: Authentication, setState: React.Dispatch<React.SetStateAction<Authentication>>) {
	const [clientId, domain] = getAuth0Options();

	const authenticate = async () => {
		const auth0 = await createAuth0Client({
			clientId: clientId,
			domain: domain,
			cacheLocation: "localstorage"
		});

		await auth0.checkSession();

		if (await auth0.isAuthenticated() == false) {
			await auth0.loginWithPopup({
				authorizationParams: {
					redirect_uri: window.location.origin
				}
			});
		}

		const user = await auth0.getUser<User>()
		if (!user) throw new Error("Failed to get user");

		let newState: Authentication = {
			authenticated: true,
			logout: () => {
				auth0.logout({
					logoutParams: {
						returnTo: window.location.origin
					}
				});
				setState(defaultValue);
			},
			user: user
		}



		setState(newState);
	}

	if (state.authenticated === false) {
		authenticate()
			.catch(console.error);
	}
}

export function AuthenticationProvider({ children }: React.PropsWithChildren) {
	let [authenticationState, setAuthenticationState] = useState<Authentication>(defaultValue);

	useEffect(() => {
		if (authenticationState.authenticated === false) {
			authenticationState.login(authenticationState, setAuthenticationState);
		}
	}, [authenticationState])


	return (
		<AuthenticationContext.Provider value={authenticationState}>
			{children}
		</AuthenticationContext.Provider>
	);
}

export function useAuthentication(): Authentication {
	return useContext(AuthenticationContext);
}

export function useUser(): User | null {
	const context = useContext(AuthenticationContext);
	if (context.authenticated) {
		return context.user;
	}

	return null;
}

export function useLogout(): (() => void) | null {
	const context = useContext(AuthenticationContext);
	if (context.authenticated) {
		return context.logout;
	}

	return null;
}
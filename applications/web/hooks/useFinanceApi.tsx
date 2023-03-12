import { useAuth0 } from "@auth0/auth0-react";
import { DefaultApi } from "@finance/svc-user-sdk";
import { createContext, useContext, useState } from "react";

const financeApiContext = createContext<DefaultApi | null>(null);

export function FinanceApiProvider(props: React.PropsWithChildren) {
	const [api, setApi] = useState<DefaultApi | null>(null);
	const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

	if (api == null && !isLoading && isAuthenticated) {
		getAccessTokenSilently({
			authorizationParams: {
				redirect_uri: process.env["NEXT_PUBLIC_AUTH0_ORIGIN"],
				audience: process.env["NEXT_PUBLIC_AUTH0_AUDIENCE"]
			}
		}).then((token) => {
			if (api == null && token != "") { 
				setApi(new DefaultApi({
					accessToken: token,
					isJsonMime: mime => mime === 'application/json',
				}, "http://localhost:3000"))
			}
		});
	}

	return (
		<financeApiContext.Provider value={api}>
			{props.children}
		</financeApiContext.Provider>
	);
}

export function useApiRequest<T extends keyof DefaultApi>(request: T, ...args: Parameters<DefaultApi[T]>): [Awaited<ReturnType<DefaultApi[T]>> | null, Error | null, DefaultApi | null] {
	const { api, isConnected } = useApi();
	const [result, setResult] = useState<Awaited<ReturnType<DefaultApi[T]>> | null>(null);
	const [error, setError] = useState<Error | null>(null);
	if (!isConnected || api == null) { 
		return [result, error, api];
	}

	if (result != null || error != null) {
		return [result, error, api];
	}

	(api[request] as any).apply(api, args).then(setResult).catch(setError);

	return [result, error, api];
}

export function useApi(): {isConnected:false,api:null} | {isConnected:true,api:DefaultApi} {
	const context = useContext(financeApiContext);
	
	if (context == null) {
		return {
			isConnected: false,
			api: null,
		};
	}

	return {
		isConnected: true,
		api: context,
	};
}

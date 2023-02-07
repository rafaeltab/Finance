import type { UserResponse } from "@finance/api~sdk";
import { useState } from "react";
import { useUser, catchAuth } from "./useAuthentication";
import { useApi } from "./useFinanceApi";

export function useApiUser(isCreateUser: boolean = false) {
	const api = useApi();
	const authUser = useUser(true);

	const [user, setUsers] = useState<UserResponse | null>(null);

	if (isCreateUser) return;

	if (api.isConnected && user == null && authUser != null && authUser.sub != undefined) {
		console.log("api is connected")
		api.api.userControllerGetByIdentity(authUser.sub).then((response) => {
			setUsers(response.data);
		}).catch(catchAuth);
	}

	return user;
}
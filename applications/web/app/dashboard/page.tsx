"use client"

import React from 'react';
import { DefaultPage } from '../../components/defaultPage';
import { useApiUser } from '../../hooks/useUserExists';

export default function Dashboard() {
	const apiUser = useApiUser();


	if (apiUser == null) return (
		<DefaultPage title="Dashboard">
			<div>Loading...</div>
		</DefaultPage>)

	return (
		<DefaultPage title="Dashboard">
			<div>
				{apiUser.firstName} {apiUser.lastName} {apiUser.dateOfBirth}
			</div>
		</DefaultPage>
	)
}


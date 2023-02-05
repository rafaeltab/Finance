"use client"
import React, { useState } from 'react'
import { useApi } from '../../hooks/useFinanceApi'
import type { UserResponse } from "@finance/api~sdk";

export default function Dashboard() {
	const api = useApi();

	const [users, setUsers] = useState<UserResponse[] | null>(null);

	if (api.isConnected && users == null) { 
		console.log("api is connected")
		api.api.userControllerGet().then((response) => {
			setUsers(response.data.data.data);
		})
	}

	return (
		<>
			<header className="bg-gray-800 shadow">
				<div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 pb-32">
					<h1 className="text-3xl font-bold tracking-tight text-gray-200">Dashboard</h1>
				</div>
			</header>
			<main className='-mt-32'>
				<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
					{/* Replace with your content */}
					<div className="px-4 py-6 sm:px-0">
						<div className="h-96 rounded-lg bg-white p-10 shadow-md" >
							{users?.map((user, index) => (
								<div key={index}>
									{user.firstName} {user.lastName} { user.dateOfBirth}
								</div>
							))}
						</div>
					</div>
					{/* /End replace */}
				</div>
			</main>
		</>
	)
}

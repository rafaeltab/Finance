"use client"
import React from 'react';
import { useApiUser } from '../../hooks/useUserExists';

export default function Dashboard() {
	const apiUser = useApiUser();


	if(apiUser == null) return (<BaseDashboard><div>Loading...</div></BaseDashboard>)

	return (
		<BaseDashboard>
			<div>
				{apiUser.firstName} {apiUser.lastName} {apiUser.dateOfBirth}
			</div>
		</BaseDashboard>
	)
}

function BaseDashboard(props: React.PropsWithChildren) { 
	return (<>
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

						{props.children}

					</div>
				</div>
				{/* /End replace */}
			</div>
		</main>
	</>);
}

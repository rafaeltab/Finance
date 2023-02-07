"use client";

import { useUser } from '../../hooks/useAuthentication';
import { useApiRequest } from '../../hooks/useFinanceApi';

export default function Assets() {
	const authUser = useUser(false);

	const [res, error] = useApiRequest("assetControllerGetUserAssets", authUser.sub)

	if (res == null || error !== null) { 
		return <div>Loading</div>
	}

	const { data, page } = res.data.data;

	return (
		<>
			<header className="bg-gray-800 shadow">
				<div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 pb-32">
					<h1 className="text-3xl font-bold tracking-tight text-gray-200">Assets</h1>
				</div>
			</header>
			<main className='-mt-32'>
				<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
					{/* Replace with your content */}
					<div className="px-4 py-6 sm:px-0">
						<div className="h-96 rounded-lg bg-white p-10 shadow-md" >
							<p>Amount {data.length}</p>
							<p>Total: {page.total}</p>
						</div>
					</div>
					{/* /End replace */}
				</div>
			</main>
		</>
	)
}

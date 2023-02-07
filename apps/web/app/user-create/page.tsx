"use client";

import { useState } from 'react';
import { useUser } from '../../hooks/useAuthentication';
import { useApiRequest } from '../../hooks/useFinanceApi';

export default function UserCreate() {
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [dateOfBirth, setdateOfBirth] = useState<string>("");

	const authUser = useUser();
	if (authUser == null || authUser.sub == undefined) {
		throw new Error("User is not authenticated");
	}

	const [existingUser, error, api] = useApiRequest("userControllerGetByIdentity", authUser.sub)
	const [submitted, setSubmitted] = useState<boolean>(false);


	if (!existingUser && !error || api == null) {
		return (<></>);
	}

	if (existingUser) {
		window.location.replace("/dashboard");
		return (<></>);
	}

	return (
		<>
			<header className="bg-gray-800 shadow">
				<div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 pb-32">
					<h1 className="text-3xl font-bold tracking-tight text-gray-200">User creation</h1>
				</div>
			</header>
			<main className='-mt-32'>
				<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
					{/* Replace with your content */}
					<div className="px-4 py-6 sm:px-0">
						<div className="min-h-96 rounded-lg bg-white p-10 shadow-md" >

							<form onSubmit={async (event) => {
								event.preventDefault();
								if(dateOfBirth == "" || firstName == "" || lastName == "" || submitted) {
									return;
								}

								setSubmitted(true);

								const res = await api.userControllerInsert({
									dateOfBirth: dateOfBirth,
									firstName: firstName,
									lastName: lastName,
								});

								if (res.data.userIdentity != authUser.sub) { 
									throw new Error("User identity does not match");
								}
							}}>
								<div className="">
									<div className="bg-white px-4 py-5 sm:p-6">
										<div className="grid grid-cols-6 gap-6">
											<div className="col-span-6 sm:col-span-3">
												<label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
													First name
													<span className="text-red-500 ml-1" hidden>Error</span>
												</label>
												<input
													type="text"
													name="first-name"
													id="first-name"
													autoComplete="given-name"
													value={firstName}
													onChange={(event) => {
														setFirstName(event.target.value);
													}}
													className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border-solid border"
												/>
											</div>

											<div className="col-span-6 sm:col-span-3">
												<label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
													Last name
													<span className="text-red-500 ml-1" hidden>Error</span>
												</label>
												<input
													type="text"
													name="last-name"
													id="last-name"
													autoComplete="family-name"
													value={lastName}
													onChange={(event) => {
														setLastName(event.target.value);
													}}
													className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border-solid border"
												/>
											</div>
											<div className="col-span-6 sm:col-span-3 lg:col-span-2">
												<label htmlFor="region" className="block text-sm font-medium text-gray-700">
													Date of birth
													<span className="text-red-500 ml-1" hidden>Error</span>
												</label>
												<input
													type="date"
													name="dateOfBirth"
													id="dateOfBirth"
													autoComplete="date-of-birth"
													value={dateOfBirth}
													onChange={(event) => {
														setdateOfBirth(event.target.value);
													}}
													className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border-solid border"
												/>
											</div>
										</div>

									</div>
									<div className="px-4 py-3 text-right sm:px-6">
										<button
											type="submit"
											className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										>
											Save
										</button>
									</div>
								</div>
							</form>

						</div>
					</div>
					{/* /End replace */}
				</div>
			</main>
		</>
	)
}

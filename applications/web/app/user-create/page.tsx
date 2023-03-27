"use client";

import { useState } from 'react';
import { useUser } from '../../hooks/useAuthentication';
import { useApiRequest } from '../../hooks/useFinanceApi';

export default function UserCreate() {
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [dateOfBirth, setdateOfBirth] = useState<string>("");

	const authUser = useUser();
	if (authUser == null || authUser.sub === undefined) {
		throw new Error("User is not authenticated");
	}

	const [existingUser, error, api] = useApiRequest("userControllerGetByIdentity", authUser.sub)
	const [submitted, setSubmitted] = useState<boolean>(false);


	if (!existingUser && !error || api == null) {
		return null;
	}

	if (existingUser) {
		window.location.replace("/dashboard");
		return null;
	}

	return (
		<>
			<header className="bg-gray-800 shadow">
				<div className="px-4 py-6 pb-32 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold tracking-tight text-gray-200">User creation</h1>
				</div>
			</header>
			<main className='-mt-32'>
				<div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
					{/* Replace with your content */}
					<div className="px-4 py-6 sm:px-0">
						<div className="p-10 bg-white rounded-lg shadow-md min-h-96" >

							<form onSubmit={async (event) => {
								event.preventDefault();
								if (dateOfBirth === "" || firstName === "" || lastName === "" || submitted) {
									return;
								}

								setSubmitted(true);

								const res = await api.userControllerInsert({
									dateOfBirth,
									firstName,
									lastName,
								});

								if (res.data.userIdentity !== authUser.sub) {
									throw new Error("User identity does not match");
								}
							}}>
								<div className="">
									<div className="px-4 py-5 bg-white sm:p-6">
										<div className="grid grid-cols-6 gap-6">
											<div className="col-span-6 sm:col-span-3">
												<label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
													First name
													<span className="ml-1 text-red-500" hidden>Error</span>
													<input
														type="text"
														name="first-name"
														id="first-name"
														autoComplete="given-name"
														value={firstName}
														onChange={(event) => {
															setFirstName(event.target.value);
														}}
														className="block w-full p-2 mt-1 border border-gray-300 border-solid rounded-md shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													/>
												</label>
											</div>

											<div className="col-span-6 sm:col-span-3">
												<label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
													Last name
													<span className="ml-1 text-red-500" hidden>Error</span>
													<input
														type="text"
														name="last-name"
														id="last-name"
														autoComplete="family-name"
														value={lastName}
														onChange={(event) => {
															setLastName(event.target.value);
														}}
														className="block w-full p-2 mt-1 border border-gray-300 border-solid rounded-md shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													/>
												</label>
											</div>
											<div className="col-span-6 sm:col-span-3 lg:col-span-2">
												<label htmlFor="region" className="block text-sm font-medium text-gray-700">
													Date of birth
													<span className="ml-1 text-red-500" hidden>Error</span>
													<input
														type="date"
														name="dateOfBirth"
														id="dateOfBirth"
														autoComplete="date-of-birth"
														value={dateOfBirth}
														onChange={(event) => {
															setdateOfBirth(event.target.value);
														}}
														className="block w-full p-2 mt-1 border border-gray-300 border-solid rounded-md shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													/>
												</label>
											</div>
										</div>

									</div>
									<div className="px-4 py-3 text-right sm:px-6">
										<button
											type="submit"
											className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

import type { AssetGroupResponse } from "@finance/svc-user-sdk";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, type Dispatch, type SetStateAction } from "react";
import type { useUser } from "../../hooks/useAuthentication";
import { useApi } from "../../hooks/useFinanceApi";

export function AddAssetGroupSlideOver({open, setOpen, user, addAssetGroup}: {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	user: ReturnType<typeof useUser>;
	addAssetGroup: (asset: AssetGroupResponse) => void
}) {
	const { isConnected, api } = useApi();
	const [name, setName] = useState<string>("");

	const saveAction = async (): Promise<AssetGroupResponse> => {
		if (!isConnected || !user) {
			// show some error
			throw new Error();
		}

		if (!name) {
			// show some error
			throw new Error();
		}

		const res = await api.assetControllerCreateAssetGroupForUser(user.sub, {
			name
		});

		if (res.data.data === undefined) {
			// show some error
			throw new Error();
		}

		setOpen(false);

		return res.data.data;
	};

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-in-out duration-500"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in-out duration-500"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<Dialog.Panel className="w-screen max-w-xl pointer-events-auto">
									<div className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl">
										<div className="flex flex-col flex-1 min-h-0 py-6 overflow-y-scroll">
											<div className="px-4 sm:px-6">
												<div className="flex items-start justify-between">
													<Dialog.Title className="text-lg font-medium text-gray-900">
														Add asset group
													</Dialog.Title>
													<div className="flex items-center ml-3 h-7">
														<button
															type="button"
															className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
															onClick={() => setOpen(false)}
														>
															<span className="sr-only">Close panel</span>
															<XMarkIcon
																className="w-6 h-6"
																aria-hidden="true"
															/>
														</button>
													</div>
												</div>
											</div>
											<div className="relative flex-1 px-4 mt-6 sm:px-6">
												{/* Replace with your content */}
												<div className="mt-4">
													<div>
														<label
															htmlFor="name"
															className="block text-sm font-medium text-gray-700"
														>
															Name
															<div className="mt-1">
																<input
																	type="text"
																	name="name"
																	id="name"
																	value={name ?? ""}
																	onChange={(e) => setName(e.target.value)}
																	className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
																	placeholder="Name"
																/>
															</div>
														</label>
													</div>
												</div>

												{/* /End replace */}
											</div>
										</div>
										<div className="flex justify-end flex-shrink-0 px-4 py-4">
											<button
												type="button"
												className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
												onClick={() => setOpen(false)}
											>
												Cancel
											</button>
											<button
												type="submit"
												className="inline-flex justify-center px-4 py-2 ml-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
												onClick={() => {
													saveAction().then((data) => {
														addAssetGroup(data);
													});
												}}
											>
												Create
											</button>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
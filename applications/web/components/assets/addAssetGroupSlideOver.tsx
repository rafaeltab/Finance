import type { AssetGroupResponse } from "@finance/svc-user-sdk";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, type Dispatch, type SetStateAction } from "react";
import type { useUser } from "../../hooks/useAuthentication";
import { useApi } from "../../hooks/useFinanceApi";

export function AddAssetGroupSlideOver(props: {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	user: ReturnType<typeof useUser>;
	addAssetGroup: (asset: AssetGroupResponse) => void
}) {
	const { open, setOpen } = props;

	const { isConnected, api } = useApi();
	const [name, setName] = useState<string>("");

	var saveAction = async (): Promise<AssetGroupResponse> => {
		if (!isConnected || !props.user) {
			// show some error
			throw new Error();
		}

		if (!name) {
			// show some error
			throw new Error();
		}

		const res = await api.assetControllerCreateAssetGroupForUser(props.user.sub, {
			name
		});

		if (res.data.data === undefined) {
			// show some error
			throw new Error();
		}

		props.setOpen(false);

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
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<Dialog.Panel className="pointer-events-auto w-screen max-w-xl">
									<div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
										<div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
											<div className="px-4 sm:px-6">
												<div className="flex items-start justify-between">
													<Dialog.Title className="text-lg font-medium text-gray-900">
														Add asset group
													</Dialog.Title>
													<div className="ml-3 flex h-7 items-center">
														<button
															type="button"
															className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
															onClick={() => setOpen(false)}
														>
															<span className="sr-only">Close panel</span>
															<XMarkIcon
																className="h-6 w-6"
																aria-hidden="true"
															/>
														</button>
													</div>
												</div>
											</div>
											<div className="relative mt-6 flex-1 px-4 sm:px-6">
												{/* Replace with your content */}
												<div className="mt-4">
													<div>
														<label
															htmlFor="name"
															className="block text-sm font-medium text-gray-700"
														>
															Name
														</label>
														<div className="mt-1">
															<input
																type="text"
																name="name"
																id="name"
																value={name ?? ""}
																onChange={(e) => setName(e.target.value)}
																className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
																placeholder="Name"
															/>
														</div>
													</div>
												</div>

												{/* /End replace */}
											</div>
										</div>
										<div className="flex flex-shrink-0 justify-end px-4 py-4">
											<button
												type="button"
												className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
												onClick={() => setOpen(false)}
											>
												Cancel
											</button>
											<button
												type="submit"
												className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
												onClick={() => {
													saveAction().then((data) => {
														props.addAssetGroup(data);
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
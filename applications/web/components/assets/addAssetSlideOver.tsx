import type { AssetResponse } from "@finance/api~sdk";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { forwardRef, Fragment, useImperativeHandle, useRef, useState, type Dispatch, type ForwardedRef, type SetStateAction } from "react";
import { useApi } from "../../hooks/useFinanceApi";
import { classNames } from "../../util/classNames";

const addAssetSlideOverTabs = ["stock", "realEstate"] as const;
type AddAssetSlideOverTab = typeof addAssetSlideOverTabs[number];
const pretty: Record<AddAssetSlideOverTab, string> = {
	stock: "Stock",
	realEstate: "Real Estate",
};

type RefType = {
	saveAction: () => Promise<AssetResponse>;
}

type TabProps = {
	context: AddAssetSlideOverContextType;
	ref: ForwardedRef<RefType | undefined>
}
const tabMap: Record<AddAssetSlideOverTab, (props: TabProps) => JSX.Element> = {
	stock: (props: TabProps) => (<AddAssetStockTab ref={props.ref} context={props.context} />),
	realEstate: (props: TabProps) => (<AddAssetRealEstateTab ref={props.ref} context={props.context} />),
};

export type AddAssetSlideOverContextType = { type: "user" | "group", id: string };

export function AddAssetSlideOver(props: {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	addAssetToUser: (asset: AssetResponse) => void;
	addAssetToGroup: (asset: AssetResponse, group: string) => void;
	context: AddAssetSlideOverContextType
}) {
	const { open, setOpen } = props;

	const [currentTab, setCurrentTab] = useState<AddAssetSlideOverTab>("stock");
 
	const ref = useRef<RefType>();

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
														Add asset {props.context.type == "group" ? `to group` : "to user"}
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
												<div className="border-b border-gray-200">
													<nav className="-mb-px flex" aria-label="Tabs">
														{addAssetSlideOverTabs.map((tab) => (
															<a
																key={tab}
																className={classNames(
																	currentTab == tab
																		? "border-indigo-500 text-indigo-600"
																		: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
																	"w-full py-4 px-1 text-center border-b-2 font-medium text-sm"
																)}
																aria-current={
																	currentTab == tab ? "page" : undefined
																}
																onClick={() => setCurrentTab(tab)}
															>
																{pretty[tab]}
															</a>
														))}
													</nav>
												</div>

												<div className="mt-4">{tabMap[currentTab]({ context: props.context, ref })}</div>

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
													ref?.current?.saveAction().then((data) => {
														if (props.context.type == "group") {
															props.addAssetToGroup(data, props.context.id);
														} else { 
															props.addAssetToUser(data);
														}
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

const AddAssetRealEstateTab = forwardRef(function (props: { context: AddAssetSlideOverContextType }, ref: ForwardedRef<RefType | undefined>) {
	const [address, setAddress] = useState<string | undefined>(undefined);
	const { api, isConnected } = useApi();

	var saveAction = async (): Promise<AssetResponse> => {
		if (!isConnected || !props.context) {
			// show some error
			throw new Error();
		}

		if (!address) {
			// show some error
			throw new Error();
		}

		if (props.context.type == "user") {
			const res = await api.assetControllerCreateRealEstateAssetForUser(props.context.id, {
				address
			});
	
			if (res.data.data === undefined) {
				// show some error
				throw new Error();
			}
	
			return res.data.data;
		} else { 
			const res = await api.assetControllerCreateRealEstateAssetForGroup(props.context.id, {
				address
			});

			if (res.data.data === undefined) {
				// show some error
				throw new Error();
			}

			return res.data.data;
		}

	};

	useImperativeHandle(ref, () => {
		return {
			saveAction
		}
	});

	return (
		<div>
			<label
				htmlFor="address"
				className="block text-sm font-medium text-gray-700"
			>
				Address
			</label>
			<div className="mt-1">
				<input
					type="text"
					name="address"
					id="address"
					value={address ?? ""}
					onChange={(e) => setAddress(e.target.value)}
					className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					placeholder="1600 Pennsylvania Avenue"
				/>
			</div>
		</div>
	);
});

const AddAssetStockTab = forwardRef(function (props: { context: AddAssetSlideOverContextType }, ref: ForwardedRef<RefType | undefined>) {
	const [symbol, setSymbol] = useState<string | undefined>(undefined);
	const [exchange] = useState<string | undefined>("NASDAQ");
	const [amount, setAmount] = useState<string | undefined>(undefined);
	const [price, setPrice] = useState<string | undefined>(undefined);
	const { api, isConnected } = useApi();

	var saveAction = async () => {
		if (!isConnected || !props.context) {
			// show some error
			throw new Error();
		}

		if (!symbol || !exchange || !amount || !price) {
			// show some error
			throw new Error();
		}

		const { data } = await api.stockControllerGetSearch(exchange, symbol, "CS");
		const stock = data.data.data;

		if (stock.length === 0 || stock[0]?.identity === undefined) {
			// show some error
			throw new Error();
		}

		if (props.context.type == "user") {
			const res = await api.assetControllerCreateStockAssetForUser(props.context.id, {
				stockOrders: [
					{
						amount: parseFloat(amount),
						price: parseFloat(price)
					}
				],
				stockDataIdentity: stock[0]?.identity
			});

			if (res.data.data === undefined) {
				// show some error
				throw new Error();
			}

			return res.data.data;
		} else {
			const res = await api.assetControllerCreateStockAssetForGroup(props.context.id, {
				stockOrders: [
					{
						amount: parseFloat(amount),
						price: parseFloat(price)
					}
				],
				stockDataIdentity: stock[0]?.identity
			});

			if (res.data.data === undefined) {
				// show some error
				throw new Error();
			}

			return res.data.data;
		}
	};

	useImperativeHandle(ref, () => {
		return {
			saveAction
		}
	});

	return (
		<div className="flex flex-col gap-2">
			<div>
				<label
					htmlFor="symbol"
					className="block text-sm font-medium text-gray-700"
				>
					Symbol
				</label>
				<div className="mt-1">
					<input
						type="text"
						name="symbol"
						id="symbol"
						value={symbol ?? ""}
						onChange={(event) => {
							setSymbol(event.target.value.toUpperCase())
						}}
						className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						placeholder="GOOG"
					/>
				</div>
			</div>
			<div>
				<label
					htmlFor="exchange"
					className="block text-sm font-medium text-gray-700"
				>
					Exchange
				</label>
				<div className="mt-1">
					<input
						type="text"
						name="exchange"
						id="exchange"
						value={exchange ?? ""}
						className="block w-full bg-gray-200 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						placeholder="NASDAQ"
						disabled
						readOnly
					/>
				</div>
			</div>
			<div className="flex gap-2">
				<div>
					<label htmlFor="price" className="block text-sm font-medium text-gray-700">
						Price
					</label>
					<div className="relative mt-1 rounded-md shadow-sm">
						<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<span className="text-gray-500 sm:text-sm">$</span>
						</div>
						<input
							type="number"
							name="price"
							id="price"
							value={price ?? ""}
							onChange={(event) => {
								setPrice(event.target.value)
							}}
							className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="0.00"
							aria-describedby="price-currency"
						/>
						<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
							<span className="text-gray-500 sm:text-sm" id="price-currency">
								USD
							</span>
						</div>
					</div>
				</div>
				<div>
					<label
						htmlFor="amount"
						className="block text-sm font-medium text-gray-700"
					>
						Amount
					</label>
					<div className="mt-1">
						<input
							type="number"
							name="amount"
							id="amount"
							value={amount ?? ""}
							onChange={(event) => {
								setAmount(event.target.value)
							}}
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="3"
						/>
					</div>
				</div>
			</div>

		</div>
	);
});
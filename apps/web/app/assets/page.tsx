"use client";

import type { AssetGroupResponse, AssetResponse, PaginatedResponsePage, StockOrderResponse } from '@finance/api~sdk';
import { Transition, Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, Fragment, Dispatch, SetStateAction } from 'react';
import { Seek } from 'react-loading-indicators';
import { useUser } from '../../hooks/useAuthentication';
import { useApiRequest } from '../../hooks/useFinanceApi';
import { classNames } from '../../util/classNames';

type AllData = {
	assets: AssetResponse[] | null;
	assetPage: PaginatedResponsePage | null;
	assetGroups: AssetGroupResponse[] | null;
	assetGroupsPage: PaginatedResponsePage | null;
	isLoading: boolean;
}

export default function Assets() {
	const authUser = useUser(false);
	let [assetResponse, assetError] = useApiRequest("assetControllerGetUserAssets", authUser.sub)
	let [assetGroupResponse, assetGroupError] = useApiRequest("assetControllerGetUserAssetGroups", authUser.sub);

	const isLoading = assetResponse == null || assetError !== null || assetGroupResponse == null || assetGroupError !== null;

	const data = {
		assets: assetResponse?.data.data.data ?? null,
		assetPage: assetResponse?.data.data.page ?? null,
		assetGroups: assetGroupResponse?.data.data.data ?? null,
		assetGroupsPage: assetGroupResponse?.data.data.page ?? null,
		isLoading: isLoading,
	} satisfies AllData

	const [addAssetOpen, addAssetSetOpen] = useState(false);

	return (
		<BasePage >
			<div className="px-4 sm:px-6 lg:px-8">
				<Header addAssetSetOpen={addAssetSetOpen} />
				<AddAssetSlideOver open={addAssetOpen} setOpen={addAssetSetOpen} />
				<div className="mt-8 flex flex-col">
					<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
							<Table assets={data.assets} assetPage={data.assetPage} assetGroups={data.assetGroups} assetGroupsPage={data.assetGroupsPage} isLoading={isLoading} />
						</div>
					</div>
				</div>
			</div>
		</BasePage>
	);
}

function Table({ assets, isLoading, assetGroups }: AllData) {
	return (
		<table className="min-w-full divide-y divide-gray-300">
			<thead>
				<tr>
					<th
						scope="col"
						className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-2"
					>
						Name
					</th>
					<th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
						Title
					</th>
					<th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
						Price
					</th>
				</tr>
			</thead>
			<tbody className="divide-y divide-gray-200">
				{(assets ?? []).map((asset) => (
					<AssetRow asset={asset} key={asset.identity} />
				))}
				{(assetGroups ?? []).map((assetGroup) => {
					return (
						<>
							<AssetGroupRow assetGroup={assetGroup} key={assetGroup.identity} />
							{(assetGroup.assets ?? []).map((asset) => (
								<AssetRow asset={asset} key={asset.identity} />
							))}
						</>
					);
				})}
				{isLoading ? (
					<tr>
						<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-2">
							<Seek color={"rgb(55 65 81)"} size="small" />
						</td>
						<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
							<Seek color={"rgb(55 65 81)"} size="small" />
						</td>
						<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
							<Seek color={"rgb(55 65 81)"} size="small" />
						</td>
					</tr>
				) : undefined}

			</tbody>
		</table>
	);
}

const addAssetSlideOverTabs = ["stock", "realEstate"] as const;
type AddAssetSlideOverTab = typeof addAssetSlideOverTabs[number];
const pretty: Record<AddAssetSlideOverTab, string> = {
	stock: "Stock",
	realEstate: "Real Estate",
}
const tabMap: Record<AddAssetSlideOverTab, JSX.Element> = {
	stock: <AddAssetStockTab />,
	realEstate: <AddAssetRealEstateTab />,
}

function AddAssetSlideOver(props: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
	const { open, setOpen } = props;
	
	const [currentTab, setCurrentTab] = useState<AddAssetSlideOverTab>("stock");

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
													<Dialog.Title className="text-lg font-medium text-gray-900">Panel title</Dialog.Title>
													<div className="ml-3 flex h-7 items-center">
														<button
															type="button"
															className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
															onClick={() => setOpen(false)}
														>
															<span className="sr-only">Close panel</span>
															<XMarkIcon className="h-6 w-6" aria-hidden="true" />
														</button>
													</div>
												</div>
											</div>
											<div className="relative mt-6 flex-1 px-4 sm:px-6">
												{/* Replace with your content */}
												<div>
													<div className="sm:hidden">
														<label htmlFor="tabs" className="sr-only">
															Select a tab
														</label>
														{/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
														<select
															id="tabs"
															name="tabs"
															className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
															value={currentTab}
															defaultValue={"stock"}
														>
															{addAssetSlideOverTabs.map((tab) => (
																<option key={tab}>{pretty[tab]}</option>
															))}
														</select>
													</div>
													<div className="hidden sm:block">
														<div className="border-b border-gray-200">
															<nav className="-mb-px flex" aria-label="Tabs">
																{addAssetSlideOverTabs.map((tab) => (
																	<a
																		key={tab}
																		onClick={() => setCurrentTab(tab)}
																		className={classNames(
																			currentTab == tab
																				? 'border-indigo-500 text-indigo-600'
																				: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
																			'w-full py-4 px-1 text-center border-b-2 font-medium text-sm'
																		)}
																		aria-current={currentTab == tab ? 'page' : undefined}
																	>
																		{pretty[tab]}
																	</a>
																))}
															</nav>
														</div>
													</div>
												</div>

												<div className='mt-4'>
													{tabMap[currentTab]}
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
											>
												Save
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
	)
}

function AddAssetStockTab() {
	return (
		<></>
	);
}

function AddAssetRealEstateTab() {
	return (
		<div>
			<label htmlFor="address" className="block text-sm font-medium text-gray-700">
				Address
			</label>
			<div className="mt-1">
				<input
					type="text"
					name="address"
					id="address"
					className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					placeholder="1600 Pennsylvania Avenue"
				/>
			</div>
		</div>
	);
}

// @tailwindcss/forms, @tailwindcss/typography, and @tailwindcss/aspect-ratio
function AssetRow({ asset }: { asset: AssetResponse }) {
	return (
		<tr>
			<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-2">
				{asset.stockAsset?.stockData.symbol ?? asset.realEstateAsset?.address}
			</td>
			<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
				{asset.stockAsset?.stockData.exchange ?? ""}
			</td>
			<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
				{calculateTotalValue(asset.stockAsset?.orders) ?? ""}
			</td>
			<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
				<a href="#" className="text-indigo-600 hover:text-indigo-900 pr-2">
					View<span className="sr-only">, {asset.identity}</span>
				</a>
			</td>
		</tr>
	);
}

function AssetGroupRow({ assetGroup }: { assetGroup: AssetGroupResponse }) {
	return (
		<tr className='bg-gray-50'>
			<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-2">
				{assetGroup.name}
			</td>
			<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
			</td>
			<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
			</td>
			<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
				<a href="#" className="text-indigo-600 hover:text-indigo-900 pr-2">
					View<span className="sr-only">, {assetGroup.identity}</span>
				</a>
			</td>
		</tr>
	);
}

function Header(props: {addAssetSetOpen: Dispatch<SetStateAction<boolean>>}) {
	return (
		<div className="sm:flex sm:items-center">
			<div className="sm:flex-auto">
				<p className="mt-2 text-sm text-gray-700">
					A list of all the assets in your account
				</p>
			</div>
			<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
				<button
					type="button"
					className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
					onClick={() => props.addAssetSetOpen(true)}
				>
					Add asset
				</button>
			</div>
		</div>
	);
}

function BasePage(props: React.PropsWithChildren) {
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
						<div className="rounded-lg bg-white p-10 shadow-md" >
							{props.children}
						</div>
					</div>
					{/* /End replace */}
				</div>
			</main>
		</>
	);
}

function calculateTotalValue(stockOrders: StockOrderResponse[] | undefined) {
	if (!stockOrders) return undefined;

	const totalValue = stockOrders.reduce((a, b) => a + b.amount * b.usdPrice, 0);
	return `$${totalValue}`;
}

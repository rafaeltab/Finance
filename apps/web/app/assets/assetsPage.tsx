"use client";

import type {
	AssetGroupResponse,
	AssetResponse, PaginatedResponsePage,
	StockOrderResponse
} from "@finance/api~sdk";
import { Menu, Transition } from "@headlessui/react";
import { ArrowLongLeftIcon, ArrowLongRightIcon, ChevronDownIcon, EllipsisVerticalIcon, EyeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Seek } from "react-loading-indicators";
import { AddAssetGroupSlideOver } from "../../components/assets/addAssetGroupSlideOver";
import { AddAssetSlideOver, AddAssetSlideOverContextType } from "../../components/assets/addAssetSlideOver";
import { useAdditionalData } from "../../hooks/useAdditionalData";
import { useUser } from "../../hooks/useAuthentication";
import { useApi, useApiRequest } from "../../hooks/useFinanceApi";
import { classNames } from "../../util/classNames";

type AllData = {
	assets: AssetResponse[] | null;
	assetPage: PaginatedResponsePage | null;
	assetGroups: AssetGroupResponse[] | null;
	assetGroupsPage: PaginatedResponsePage | null;
	isLoading: boolean;
	removeAssetData: (data: AssetResponse) => void;
	removeAssetGroupData: (data: AssetGroupResponse) => void;
	removeAssetFromGroupData: (data: AssetResponse, group: string) => void;
	setAddAssetContext: Dispatch<SetStateAction<AddAssetSlideOverContextType | null>>;
};

export default function Assets() {
	const authUser = useUser(false);
	let [assetResponse, assetError] = useApiRequest(
		"assetControllerGetUserAssets",
		authUser.sub
	);
	let [assetGroupResponse, assetGroupError] = useApiRequest(
		"assetControllerGetUserAssetGroups",
		authUser.sub
	);

	const { addData: addAssetData, data: assetData, removeData: removeAssetData } = useAdditionalData(assetResponse?.data?.data?.data ?? null);
	const { addData: addAssetGroupData, data: assetGroupDatas, removeData: removeAssetGroupData } = useAdditionalData(assetGroupResponse?.data?.data?.data ?? null);

	const [additionalGroupAssets, setAdditionalGroupAssets] = useState<Record<string, { addedAssets: AssetResponse[], removedAssets: AssetResponse[] }>>({});


	function calculateTotalAssetGroups() {
		console.log(assetGroupDatas)
		const c: AssetGroupResponse[] = [];

		if (assetGroupDatas === null) return c;

		for (const group of assetGroupDatas) {
			c.push({
				...group,
				assets: [
					...group.assets.filter(x => !additionalGroupAssets[group.identity]?.removedAssets.find(y => y.identity == x.identity)),
					...additionalGroupAssets[group.identity]?.addedAssets ?? []
				]
			})
		}

		return c;
	}


	const isLoading =
		assetResponse == null ||
		assetError !== null ||
		assetGroupResponse == null ||
		assetGroupError !== null;


	const [addAssetContext, setAddAssetContext] = useState<AddAssetSlideOverContextType | null>(null);
	const [addAssetGroupOpen, addAssetGroupSetOpen] = useState(false);

	if (addAssetContext && addAssetGroupOpen) addAssetGroupSetOpen(false);

	function addAssetAction(asset: AssetResponse) {
		addAssetData(asset);
		setAddAssetContext(null);
	}

	function addAssetToGroupAction(asset: AssetResponse, group: string) {
		setAdditionalGroupAssets((prev) => ({
			...prev,
			[group]: {
				removedAssets: prev[group]?.removedAssets.filter(x => x.identity != asset.identity) ?? [],
				addedAssets: [...(prev[group]?.addedAssets ?? []), asset]
			}
		}));
		setAddAssetContext(null);
	}

	var setAddAssetOpen: Dispatch<SetStateAction<boolean>> = function (value: SetStateAction<boolean>) {
		setAddAssetContext(value ? { type: "user", id: authUser.sub } : null);
	}

	function removeAssetFromGroupData(asset: AssetResponse, group: string) {
		setAdditionalGroupAssets((prev) => ({
			...prev,
			[group]: {
				addedAssets: prev[group]?.addedAssets.filter(x => x.identity != asset.identity) ?? [],
				removedAssets: [...(prev[group]?.removedAssets ?? []), asset]
			}
		}));
	}

	const data = {
		assets: assetData,
		assetPage: assetResponse?.data.data.page ?? null,
		assetGroups: calculateTotalAssetGroups(),
		assetGroupsPage: assetGroupResponse?.data.data.page ?? null,
		isLoading: isLoading,
		removeAssetData,
		removeAssetGroupData,
		setAddAssetContext,
		removeAssetFromGroupData
	} satisfies AllData;

	return (
		<BasePage>
			<div className="px-4 sm:px-6 lg:px-8">
				<Header
					addAssetSetOpen={setAddAssetOpen}
					addAssetGroupOpen={addAssetGroupSetOpen} />
				<AddAssetSlideOver
					open={addAssetContext != null}
					setOpen={setAddAssetOpen}
					context={addAssetContext ?? { type: "user", id: authUser.sub }}
					addAssetToUser={addAssetAction}
					addAssetToGroup={addAssetToGroupAction} />
				<AddAssetGroupSlideOver
					open={addAssetGroupOpen}
					setOpen={addAssetGroupSetOpen}
					user={authUser}
					addAssetGroup={addAssetGroupData} />
				<div className="mt-8 flex flex-col">
					<div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
							<Table
								assets={data.assets}
								assetPage={data.assetPage}
								assetGroups={data.assetGroups}
								assetGroupsPage={data.assetGroupsPage}
								isLoading={isLoading}
								removeAssetData={removeAssetData}
								removeAssetGroupData={removeAssetGroupData}
								setAddAssetContext={setAddAssetContext}
								removeAssetFromGroupData={removeAssetFromGroupData}
							/>
						</div>
					</div>
				</div>
			</div>
		</BasePage>
	);
}

function Table({ assets, isLoading, assetGroups, removeAssetData, removeAssetGroupData, assetGroupsPage, assetPage, setAddAssetContext, removeAssetFromGroupData }: AllData) {
	return (
		<>
			<table className="min-w-full divide-y divide-gray-300">
				<thead>
					<tr>
						<th
							scope="col"
							className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-2"
						>
							Name
						</th>
						<th
							scope="col"
							className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
						>
							Additional
						</th>
						<th
							scope="col"
							className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
						>
							Price
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200">
					{(assets ?? []).map((asset) => (
						<AssetRow
							asset={asset}
							key={asset.identity}
							removeAssetData={removeAssetData}
							removeAssetFromGroupData={removeAssetFromGroupData}
						/>
					))}
					{(assetGroups ?? []).map((assetGroup) => {
						return (
							<Fragment key={assetGroup.identity}>
								<AssetGroupRow
									assetGroup={assetGroup}
									key={assetGroup.identity}
									removeAssetGroupData={removeAssetGroupData}
									setAddAssetContext={setAddAssetContext}
								/>
								{(assetGroup.assets ?? []).map((asset) => (
									<AssetRow
										asset={asset}
										key={asset.identity}
										removeAssetData={removeAssetData}
										group={assetGroup.identity}
										removeAssetFromGroupData={removeAssetFromGroupData}
									/>
								))}
							</Fragment>
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
			<Pagination assetGroupsPage={assetGroupsPage} assetPage={assetPage} />
		</>
	);
}

function Pagination({ assetPage, assetGroupsPage }: { assetPage: PaginatedResponsePage | null, assetGroupsPage: PaginatedResponsePage | null }) {
	let previousEnabled: boolean;
	let nextEnabled: boolean;
	if (assetPage == null || assetGroupsPage == null) {
		previousEnabled = false;
		nextEnabled = false;
	} else {
		previousEnabled = assetPage.offset > 0 || assetGroupsPage.offset > 0;
		nextEnabled = assetPage.offset + assetPage.count < assetPage.total || assetGroupsPage.offset + assetGroupsPage.count < assetGroupsPage.total;
	}

	return (
		<nav className="flex w-full items-center justify-between border-t border-gray-200 px-4 sm:px-0 col-span-full">
			<div className="-mt-px flex w-0 flex-1">
				<a
					href="#"
					className={classNames(
						previousEnabled ? "text-gray-500 hover:border-gray-300 hover:text-gray-700" : "text-gray-200",
						"inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium"
					)}
					aria-disabled={!previousEnabled}
				>
					<ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
					Previous
				</a>
			</div>
			<div className="-mt-px flex w-0 flex-1 justify-end">
				<a
					href="#"
					className={classNames(
						previousEnabled ? "text-gray-500 hover:border-gray-300 hover:text-gray-700" : "text-gray-200",
						"inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium"
					)}
					aria-disabled={!nextEnabled}
				>
					Next
					<ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
				</a>
			</div>
		</nav>
	)
}


function AssetRow({ asset, removeAssetData, group, removeAssetFromGroupData }: { asset: AssetResponse, removeAssetData: (data: AssetResponse) => void, removeAssetFromGroupData: (data: AssetResponse, group: string) => void, group?: string }) {
	const { api, isConnected } = useApi();
	const [deleteRequested, setDeleteRequested] = useState(false);

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
				<DropDownActions actions={[
					...asset.stockAsset != null ? [
						{
							label: (<ViewStockDataActionLabel />),
							onClick: () => { }
						}
					] : [],
					{
						label: (<DeleteActionLabel />),
						onClick: async () => {
							if (!isConnected || deleteRequested) return;

							setDeleteRequested(true);
							await api.assetControllerDeleteAsset(asset.identity)

							if (group !== undefined) {
								removeAssetFromGroupData(asset, group);
							} else {
								removeAssetData(asset)
							}
						}
					}
				]} />
			</td>
		</tr>
	);
}

function DeleteActionLabel() {
	return (<div className="flex items-center text-red-500 hover:text-red-400">
		<TrashIcon className="h-4 w-4 mr-2" /><p>Delete</p>
	</div>);
}

function ViewStockDataActionLabel() {
	return (<div className="flex items-center text-gray-700">
		<EyeIcon className="h-4 w-4 mr-2" /><p>View stock data</p>
	</div>);
}

function AddActionLabel() {
	return (<div className="flex items-center text-gray-700">
		<PlusIcon className="h-4 w-4 mr-2" /><p>Add asset</p>
	</div>);
}

function AssetGroupRow({ assetGroup, removeAssetGroupData, setAddAssetContext }: { assetGroup: AssetGroupResponse, removeAssetGroupData: (data: AssetGroupResponse) => void, setAddAssetContext: Dispatch<SetStateAction<AddAssetSlideOverContextType | null>> }) {
	const { api, isConnected } = useApi();
	const [deleteRequested, setDeleteRequested] = useState(false);

	return (
		<tr className="bg-gray-50">
			<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-2">
				{assetGroup.name}
			</td>
			<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500"></td>
			<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500"></td>
			<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
				<DropDownActions actions={[
					{
						label: (<ViewStockDataActionLabel />),
						onClick: () => {

						}
					},
					{
						label: (<AddActionLabel />),
						onClick: () => {
							setAddAssetContext({
								type: "group",
								id: assetGroup.identity
							})
						}
					},
					{
						label: (<DeleteActionLabel />),
						onClick: async () => {
							if (!isConnected || deleteRequested) return;

							setDeleteRequested(true);
							await api.assetControllerDeleteAssetGroup(assetGroup.identity)
							console.log("Asset group remove")
							removeAssetGroupData(assetGroup)
						}
					}
				]} />
			</td>
		</tr>
	);
}

type DropDownAction = {
	label: string | JSX.Element;
	onClick: () => void;
}

function DropDownActions(props: { actions: DropDownAction[] }) {
	return (
		<Menu as="div" className="float-right inline text-left mr-4 relative">
			<div>
				<Menu.Button className="flex items-center text-gray-400 hover:text-gray-600">
					<span className="sr-only">Open options</span>
					<EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						{props.actions.map((x, i) => (
							<Menu.Item key={i}>
								<a
									onClick={x.onClick}
									className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
								>
									{x.label}
								</a>
							</Menu.Item>
						))}

					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}

function Header(props: { addAssetSetOpen: Dispatch<SetStateAction<boolean>>, addAssetGroupOpen: Dispatch<SetStateAction<boolean>> }) {
	return (
		<div className="sm:flex sm:items-center">
			<div className="sm:flex-auto">
				<p className="mt-2 text-sm text-gray-700">
					A list of all the assets in your account
				</p>
			</div>
			<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
				<AddDropDown addAssetSetOpen={props.addAssetSetOpen} addAssetGroupOpen={props.addAssetGroupOpen} />
			</div>
		</div>
	);
}

function AddDropDown(props: { addAssetSetOpen: Dispatch<SetStateAction<boolean>>, addAssetGroupOpen: Dispatch<SetStateAction<boolean>> }) {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
					Create
					<ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>

							<button
								onClick={() => props.addAssetSetOpen(true)}
								className='block px-4 py-2 text-sm text-gray-700'
							>
								Create asset
							</button>

						</Menu.Item>
						<Menu.Item>

							<button
								onClick={() => props.addAssetGroupOpen(true)}
								className='block px-4 py-2 text-sm text-gray-700'
							>
								Create asset group
							</button>

						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}

function BasePage(props: React.PropsWithChildren) {
	return (
		<>
			<header className="bg-gray-800 shadow">
				<div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 pb-32">
					<h1 className="text-3xl font-bold tracking-tight text-gray-200">
						Assets
					</h1>
				</div>
			</header>
			<main className="-mt-32">
				<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
					{/* Replace with your content */}
					<div className="px-4 py-6 sm:px-0">
						<div className="rounded-lg bg-white p-10 shadow-md">
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

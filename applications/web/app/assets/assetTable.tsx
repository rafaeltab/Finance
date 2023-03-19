import type { AssetGroupResponse, AssetResponse, PaginatedResponsePage, StockOrderResponse } from "@finance/svc-user-sdk";
import { Menu, Transition } from "@headlessui/react";
import { ArrowLongLeftIcon, ArrowLongRightIcon, EllipsisVerticalIcon, EyeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState, Fragment, Dispatch, SetStateAction } from "react";
import { Seek } from "react-loading-indicators";
import type { AddAssetSlideOverContextType } from "../../components/assets/addAssetSlideOver";
import { useApi } from "../../hooks/useFinanceApi";
import { classNames } from "../../util/classNames";
import type { AssetPageProps } from "./page";

type DropDownAction = {
	label: string | JSX.Element;
	onClick: () => void;
}

function DeleteActionLabel() {
	return (<div className="flex items-center text-red-500 hover:text-red-400">
		<TrashIcon className="w-4 h-4 mr-2" /><p>Delete</p>
	</div>);
}

function ViewStockDataActionLabel() {
	return (<div className="flex items-center text-gray-700">
		<EyeIcon className="w-4 h-4 mr-2" /><p>View stock data</p>
	</div>);
}

function AddActionLabel() {
	return (<div className="flex items-center text-gray-700">
		<PlusIcon className="w-4 h-4 mr-2" /><p>Add asset</p>
	</div>);
}

function calculateTotalValue(stockOrders: StockOrderResponse[] | undefined) {
	if (!stockOrders) return undefined;

	const totalValue = stockOrders.reduce((a, b) => a + b.amount * b.usdPrice, 0);
	return `$${totalValue}`;
}

function DropDownActions({ actions }: { actions: DropDownAction[] }) {
	return (
		<Menu as="div" className="relative inline float-right mr-4 text-left">
			<div>
				<Menu.Button className="flex items-center text-gray-400 hover:text-gray-600">
					<span className="sr-only">Open options</span>
					<EllipsisVerticalIcon className="w-6 h-6" aria-hidden="true" />
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
				<Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						{actions.map(x => (
							<Menu.Item key={x.label.toString()}>
								<button
									type="button"
									onClick={x.onClick}
									className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
								>
									{x.label}
								</button>
							</Menu.Item>
						))}

					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}

function AssetGroupRow({ assetGroup, removeAssetGroupData, setAddAssetContext }: { assetGroup: AssetGroupResponse, removeAssetGroupData: (data: AssetGroupResponse) => void, setAddAssetContext: Dispatch<SetStateAction<AddAssetSlideOverContextType | null>> }) {
	const { api, isConnected } = useApi();
	const [deleteRequested, setDeleteRequested] = useState(false);

	return (
		<tr className="bg-gray-50">
			<td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6 md:pl-2">
				{assetGroup.name}
			</td>
			<td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap" />
			<td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap" />
			<td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6 md:pr-0">
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
							removeAssetGroupData(assetGroup)
						}
					}
				]} />
			</td>
		</tr>
	);
}

function AssetRow({ asset, removeAssetData, group, removeAssetFromGroupData }: { asset: AssetResponse, removeAssetData: (data: AssetResponse) => void, removeAssetFromGroupData: (data: AssetResponse, group: string) => void, group: string | undefined }) {
	const { api, isConnected } = useApi();
	const [deleteRequested, setDeleteRequested] = useState(false);

	return (
		<tr>
			<td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6 md:pl-2">
				{asset.stockAsset?.stockData.symbol ?? asset.realEstateAsset?.address}
			</td>
			<td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
				{asset.stockAsset?.stockData.exchange ?? ""}
			</td>
			<td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
				{calculateTotalValue(asset.stockAsset?.orders) ?? ""}
			</td>
			<td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6 md:pr-0">
				<DropDownActions actions={[
					...asset.stockAsset != null ? [
						{
							label: (<ViewStockDataActionLabel />),
							onClick: () => {
								window.location.href = `/stock/${asset.stockAsset?.stockData.identity}`
							}
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
		<nav className="flex items-center justify-between w-full px-4 border-t border-gray-200 sm:px-0 col-span-full">
			<div className="flex flex-1 w-0 -mt-px">
				{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
				<a
					href="#"
					className={classNames(
						previousEnabled ? "text-gray-500 hover:border-gray-300 hover:text-gray-700" : "text-gray-200",
						"inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium"
					)}
					aria-disabled={!previousEnabled}
				>
					<ArrowLongLeftIcon className="w-5 h-5 mr-3 text-gray-400" aria-hidden="true" />
					Previous
				</a>
			</div>
			<div className="flex justify-end flex-1 w-0 -mt-px">
				{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
				<a
					href="#"
					className={classNames(
						previousEnabled ? "text-gray-500 hover:border-gray-300 hover:text-gray-700" : "text-gray-200",
						"inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium"
					)}
					aria-disabled={!nextEnabled}
				>
					Next
					<ArrowLongRightIcon className="w-5 h-5 ml-3 text-gray-400" aria-hidden="true" />
				</a>
			</div>
		</nav>
	)
}
export function Table({
	assets,
	isLoading,
	assetGroups,
	removeAssetData,
	removeAssetGroupData,
	assetGroupsPage,
	assetPage,
	setAddAssetContext,
	removeAssetFromGroupData }:
	Pick<AssetPageProps, "assets" |
		"isLoading" |
		"assetGroups" |
		"removeAssetData" |
		"removeAssetGroupData" |
		"assetGroupsPage" |
		"assetPage" |
		"setAddAssetContext" |
		"removeAssetFromGroupData">) {
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
							group={undefined}
						/>
					))}
					{(assetGroups ?? []).map((assetGroup) => (
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
					))}
					{isLoading ? (
						<tr>
							<td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6 md:pl-2">
								<Seek color="rgb(55 65 81)" size="small" />
							</td>
							<td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
								<Seek color="rgb(55 65 81)" size="small" />
							</td>
							<td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
								<Seek color="rgb(55 65 81)" size="small" />
							</td>
						</tr>
					) : undefined}
				</tbody>
			</table>
			<Pagination assetGroupsPage={assetGroupsPage} assetPage={assetPage} />
		</>
	);
}

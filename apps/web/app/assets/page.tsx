"use client";

import type { RealEstateAssetResponse, StockAssetResponse, StockOrderResponse } from '@finance/api~sdk';
import { useUser } from '../../hooks/useAuthentication';
import { useApiRequest } from '../../hooks/useFinanceApi';
import {
	HomeIcon,
	ChartBarIcon
} from '@heroicons/react/24/solid';

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
						<div className="rounded-lg bg-white p-10 shadow-md" >
							<div className="px-4 sm:px-6 lg:px-8">
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
										>
											Add asset
										</button>
									</div>
								</div>
								<div className="mt-8 flex flex-col">
									<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
										<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
											<table className="min-w-full divide-y divide-gray-300">
												<thead>
													<tr>
														<th
															scope="col"
															className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
														>
															Name
														</th>
														<th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
															Title
														</th>
														<th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
															Price
														</th>
														<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
															<span className="sr-only">Edit</span>
														</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-200">
													{data.map((asset) => (
														<tr key={asset.identity}>
															<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
																{asset.stockAsset?.stockData.symbol ?? asset.realEstateAsset?.address}
															</td>
															<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
																{asset.stockAsset?.stockData.exchange ?? ""}
															</td>
															<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
																{calculateTotalValue(asset.stockAsset?.orders) ?? ""}
															</td>
															<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
																<a href="#" className="text-indigo-600 hover:text-indigo-900">
																	Edit<span className="sr-only">, {asset.identity}</span>
																</a>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* /End replace */}
				</div>
			</main>
		</>
	)
}


function calculateTotalValue(stockOrders : StockOrderResponse[] | undefined) {
	if (!stockOrders) return undefined;
	
	const totalValue = stockOrders.reduce((a, b) => a + b.amount * b.usdPrice, 0);
	return totalValue;
}

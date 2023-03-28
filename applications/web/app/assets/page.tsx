"use client";

import type { User } from "@auth0/auth0-spa-js";
import type {
	AssetGroupResponse,
	AssetResponse, PaginatedResponsePage
} from "@finance/svc-user-sdk";
import type { Dispatch, SetStateAction } from "react";
import { AddAssetGroupSlideOver } from "../../components/assets/addAssetGroupSlideOver";
import { AddAssetSlideOver, AddAssetSlideOverContextType } from "../../components/assets/addAssetSlideOver";
import { DefaultPage } from "../../components/defaultPage";
import type { SubRequired } from "../../hooks/useAuthentication";
import { Header } from "./assetsHeader";
import { Table } from "./assetTable";
import { useAssetContainer } from "./container";

export type AssetPageProps = {
	assets: AssetResponse[] | null;
	assetPage: PaginatedResponsePage | null;
	assetGroups: AssetGroupResponse[] | null;
	assetGroupsPage: PaginatedResponsePage | null;
	isLoading: boolean;
	removeAssetData: (data: AssetResponse) => void;
	removeAssetGroupData: (data: AssetGroupResponse) => void;
	removeAssetFromGroupData: (data: AssetResponse, group: string) => void;
	setAddAssetContext: Dispatch<SetStateAction<AddAssetSlideOverContextType | null>>;
	authUser: User & SubRequired;
	setAddAssetOpen: Dispatch<SetStateAction<boolean>>;
	addAssetContext: AddAssetSlideOverContextType | null;
	addAssetAction: (asset: AssetResponse) => void;
	addAssetToGroupAction: (asset: AssetResponse, group: string) => void;
	addAssetGroupOpen: boolean,
	addAssetGroupSetOpen: Dispatch<SetStateAction<boolean>>,
	addAssetGroupData: (data: AssetGroupResponse, group: string) => void;
};

export default function Assets() {
	const data = useAssetContainer();

	// console.log(data);

	return (
		<DefaultPage title="Assets">
			<div className="px-4 sm:px-6 lg:px-8">
				<Header
					addAssetSetOpen={data.setAddAssetOpen}
					addAssetGroupOpen={data.addAssetGroupSetOpen} />
				<AddAssetSlideOver
					open={data.addAssetContext != null}
					setOpen={data.setAddAssetOpen}
					context={data.addAssetContext ?? { type: "user", id: data.authUser.sub }}
					addAssetToUser={data.addAssetAction}
					addAssetToGroup={data.addAssetToGroupAction} />
				<AddAssetGroupSlideOver
					open={data.addAssetGroupOpen}
					setOpen={data.addAssetGroupSetOpen}
					user={data.authUser}
					addAssetGroup={data.addAssetGroupData} />
				<div className="flex flex-col mt-8">
					<div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
							<Table
								assets={data.assets}
								isLoading={data.isLoading}
								assetGroups={data.assetGroups}
								removeAssetData={data.removeAssetData}
								removeAssetGroupData={data.removeAssetGroupData}
								assetGroupsPage={data.assetGroupsPage}
								assetPage={data.assetPage}
								setAddAssetContext={data.setAddAssetContext}
								removeAssetFromGroupData={data.removeAssetFromGroupData}
							/>
						</div>
					</div>
				</div>
			</div>
		</DefaultPage>
	);
}


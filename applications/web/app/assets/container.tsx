import type { AssetResponse, AssetGroupResponse } from "@finance/svc-user-sdk";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { AddAssetSlideOverContextType } from "../../components/assets/addAssetSlideOver";
import { useAdditionalData } from "../../hooks/useAdditionalData";
import { useUser } from "../../hooks/useAuthentication";
import { useApiRequest } from "../../hooks/useFinanceApi";
import type { AssetPageProps } from "./page";

export function useAssetContainer() {

    const authUser = useUser(false);
    const [assetResponse, assetError] = useApiRequest(
        "assetControllerGetUserAssets",
        authUser.sub
    );
    const [assetGroupResponse, assetGroupError] = useApiRequest(
        "assetControllerGetUserAssetGroups",
        authUser.sub
    );

    const { addData: addAssetData, data: assetData, removeData: removeAssetData } = useAdditionalData(assetResponse?.data?.data?.data ?? null);
    const { addData: addAssetGroupData, data: assetGroupDatas, removeData: removeAssetGroupData } = useAdditionalData(assetGroupResponse?.data?.data?.data ?? null);

    const [additionalGroupAssets, setAdditionalGroupAssets] = useState<Record<string, { addedAssets: AssetResponse[], removedAssets: AssetResponse[] }>>({});

    function calculateTotalAssetGroups() {
        const c: AssetGroupResponse[] = [];

        if (assetGroupDatas === null) return c;

        for (const group of assetGroupDatas) {
            c.push({
                ...group,
                assets: [
                    ...group.assets.filter(x => !additionalGroupAssets[group.identity]?.removedAssets.find(y => y.identity === x.identity)),
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
                removedAssets: prev[group]?.removedAssets.filter(x => x.identity !== asset.identity) ?? [],
                addedAssets: [...(prev[group]?.addedAssets ?? []), asset]
            }
        }));
        setAddAssetContext(null);
    }

    const setAddAssetOpen: Dispatch<SetStateAction<boolean>> = (value: SetStateAction<boolean>) => {
        setAddAssetContext(value ? { type: "user", id: authUser.sub } : null);
    }

    function removeAssetFromGroupData(asset: AssetResponse, group: string) {
        setAdditionalGroupAssets((prev) => ({
            ...prev,
            [group]: {
                addedAssets: prev[group]?.addedAssets.filter(x => x.identity !== asset.identity) ?? [],
                removedAssets: [...(prev[group]?.removedAssets ?? []), asset]
            }
        }));
    }

    const data = {
        assets: assetData,
        assetPage: assetResponse?.data.data.page ?? null,
        assetGroups: calculateTotalAssetGroups(),
        assetGroupsPage: assetGroupResponse?.data.data.page ?? null,
        isLoading,
        removeAssetData,
        removeAssetGroupData,
        setAddAssetContext,
        removeAssetFromGroupData,
        authUser,
        setAddAssetOpen,
        addAssetContext,
        addAssetAction,
        addAssetToGroupAction,
        addAssetGroupOpen,
        addAssetGroupSetOpen,
        addAssetGroupData

    } satisfies AssetPageProps;

    return data;
}
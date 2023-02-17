import { useState } from "react";

export function useAdditionalData<TData extends {identity: string}>(baseData: TData[] | null): ReturnType<TData> { 
	const [addedData, setAddedData] = useState<TData[]>([]);
	const [removedData, setRemovedData] = useState<TData[]>([]);

	const addData = (data: TData) => {
		if (removedData.find(x => x.identity === data.identity) != null) {
			setRemovedData(prev => prev.filter(x => x.identity !== data.identity));
		}

		setAddedData(prev => [...prev, data]);
	}

	const removeData = (data: TData) => {
		if (addedData.find(x => x.identity === data.identity) != null) {
			setAddedData(prev => prev.filter(x => x.identity !== data.identity));
		}

		setRemovedData(prev => [...prev, data]);
	}

	if (baseData == null || baseData == undefined) {
		if (addedData.length > 0) {
			return {
				data: createData([], addedData, removedData),
				addData,
				removeData,
			}
		}
	}

	return {
		data: baseData ? createData(baseData, addedData, removedData) : baseData,
		addData,
		removeData,
	}
}

type ReturnType<TData> = {
	data: TData[] | null;
	addData: (data: TData) => void;
	removeData: (data: TData) => void;
}

function createData<TData extends {identity: string}>(base: TData[], added: TData[], removed: TData[] ) {
	return [...base, ...added].filter(y => removed.find(x => x.identity === y.identity) == null);
}
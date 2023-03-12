"use client"

import type { CandlestickData } from "lightweight-charts";
import { Chart } from "../../../components/chart/chart";
import { DetailedChart } from "../../../components/chart/detailedChart";
import { DefaultPage } from "../../../components/defaultPage";
import { useApiRequest } from "../../../hooks/useFinanceApi";

type Props = {
	params: {
		stock: string | undefined
	}
}

export default function Page({ params }: Props) {
	if (params.stock === undefined) throw new Error();

	const [res, err, api] = useApiRequest("stockControllerGet", params.stock);

	if (res == null) {
		return <DefaultPage title="Loading">

		</DefaultPage>
	}

	

	return (
		<DefaultPage title={res.data.data.stockData.symbol}>
			<div className="h-128">
				<DetailedChart symbol={res.data.data.stockData.symbol} exchange={res.data.data.stockData.exchange} />
			</div>
		</DefaultPage>
	);
}


"use client"

import type { CandlestickData } from "lightweight-charts";
import { Chart } from "../../../components/chart/chart";
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

	const chartData: (CandlestickData)[] = res.data.data.yearlyValues.data.map((x, i) => ({
		time: `${new Date().getFullYear() - res.data.data.yearlyValues.data.length + i}-01-01`,
		...x
	} satisfies (CandlestickData)));

	return (
		<DefaultPage title={res.data.data.stockData.symbol}>
			<Chart data={chartData} colors={{
				backgroundColor: 'white',
				lineColor: '#2962FF',
				textColor: 'black',
				areaTopColor: '#2962FF',
				areaBottomColor: 'rgba(41, 98, 255, 0.28)',
			}} />
		</DefaultPage>
	);
}
import { ColorType, createChart, CandlestickData } from "lightweight-charts";
import { useEffect, useRef } from "react";
import type { Property } from "csstype";

type Props = {
	data: (CandlestickData)[],
	colors: {
		backgroundColor: Property.BackgroundColor,
		lineColor: Property.Color,
		textColor: Property.Color,
		areaTopColor: Property.Color,
		areaBottomColor: Property.Color,
	}
}

export function BasicChart({
	data,
	colors: {
		backgroundColor,
		lineColor,
		textColor,
		areaTopColor,
		areaBottomColor,
	},
}: Props) {

	const chartContainerRef = useRef<HTMLDivElement>(null);

	useEffect(
		() => {
			if (chartContainerRef.current == null) return;

			const handleResize = () => {
				chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
			};

			const chart = createChart(chartContainerRef.current, {
				layout: {
					background: { type: ColorType.Solid, color: backgroundColor },
					textColor,
				},
				width: chartContainerRef.current.clientWidth,
				height: 500,
			});
			chart.timeScale().fitContent();

			const newSeries = chart.addCandlestickSeries({
				
			});
			newSeries.setData(data);

			window.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);

				chart.remove();
			};
		},
		[data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
	);

	return (
		<div
			ref={chartContainerRef}
		/>
	);
}
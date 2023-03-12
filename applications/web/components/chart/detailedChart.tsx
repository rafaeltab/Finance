import { useEffect, useRef } from "react";

let tvScriptLoadingPromise: Promise<unknown>;

export function DetailedChart({ symbol, exchange }: {
	symbol: string,
	exchange: string
}) {
	const onLoadScriptRef = useRef<() => void>();

	useEffect(
		() => {
			onLoadScriptRef.current = createWidget;

			if (!tvScriptLoadingPromise) {
				tvScriptLoadingPromise = new Promise((resolve) => {
					const script = document.createElement('script');
					script.id = 'tradingview-widget-loading-script';
					script.src = 'https://s3.tradingview.com/tv.js';
					script.type = 'text/javascript';
					script.onload = resolve;

					document.head.appendChild(script);
				});
			}

			tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

			return () => onLoadScriptRef.current = undefined;

			function createWidget() {
				if (document.getElementById('tradingview_41ade') && 'TradingView' in window) {
					new (window as any).TradingView.widget({
						autosize: true,
						symbol: `${exchange}:${symbol}`,
						interval: "D",
						timezone: "Etc/UTC",
						theme: "light",
						style: "1",
						locale: "en",
						toolbar_bg: "#f1f3f6",
						enable_publishing: false,
						allow_symbol_change: true,
						hide_side_toolbar: false,
						details: true,
						container_id: "tradingview_41ade"
					});
				}
			}
		},
		[]
	);

	return (
		<div className='tradingview-widget-container'>
			<div className="h-128" id='tradingview_41ade' />
			<div className="tradingview-widget-copyright">
				<a href={`https://www.tradingview.com/symbols/${exchange}-${symbol}/`} rel="noopener" target="_blank"><span className="blue-text">{symbol} stock chart</span></a> by TradingView
			</div>
		</div>
	);
}
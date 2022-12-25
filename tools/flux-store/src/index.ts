import { config } from "dotenv"
config();
import { InfluxDB, Point } from "@influxdata/influxdb-client";
import csv from "csv-parser";
import { createReadStream, readdirSync } from "fs";
import { join } from "path";

const influx = new InfluxDB({
	url: process.env.INFLUX_URL,
	token: process.env.INFLUX_TOKEN,
})
const writeApi = influx.getWriteApi(process.env.INFLUX_ORG, process.env.INFLUX_BUCKET, "s", {
	flushInterval: 10,
	batchSize: 100,
	maxRetries: 5
});

const dataPath = join(__dirname, "../../dataloader/output/ohclv");
const stocks = readdirSync(dataPath);

const allPoints: Point[] = [];

const lastKnownUnsuccessfulStock = "CAT";
let writing = false;

(async function load() {
	for (const stock of stocks) {
		if (!writing) {
			if (stock === lastKnownUnsuccessfulStock) {
				writing = true;
			} else {
				continue;
			}
		}

		const stockPath = join(dataPath, stock)
		const oneDayFile = readdirSync(stockPath).find(x => x.includes("1d"))
		if (oneDayFile === undefined) continue;
		const oneDayPath = join(stockPath, oneDayFile);

		const promise = new Promise<Point[]>((resolve, reject) => {
			const points: Point[] = []
			let headerSkipped = false;
			createReadStream(oneDayPath)
				.pipe(csv())
				.on("data", (row) => {
					if (!headerSkipped) {
						headerSkipped = true;
						return;
					}
					
					if (hasInvalidColumn(row)) return;
					
					const point = new Point(stock)
						.tag("interval", "1d")
						.floatField("open", parseFloat(row.Open))
						.floatField("high", parseFloat(row.High))
						.floatField("low", parseFloat(row.Low))
						.floatField("close", parseFloat(row.Close))
						.uintField("volume", parseInt(row.Volume))
						.timestamp(new Date(row.Date));
					points.push(point);
				})
				.on("end", () => {
					resolve(points);
				});
		})
		const points = await promise;
		const size = 100;
		console.log(`${stock}: STARTING`);

		for (let i = 0; i < points.length; i += size) {
			writeApi.writePoints(points.slice(i, i + size));
			await writeApi.flush(true);
			await wait(50);
		}		

		console.log(`${stock}: ${points.length} points`);
	}

	console.log(allPoints.length);
	writeApi.close();
})();

function wait(time: number) {
	return new Promise(resolve => setTimeout(resolve, time));
}

function hasInvalidColumn(obj: Record<string, unknown>) {
	return Object.values(obj).some(isEmptyOrNullOrUndefined);
}

function isEmptyOrNullOrUndefined(value: any) {
	return value === null || value === undefined || value === "";
}

import { createGenerator } from "ts-json-schema-generator";
import fs from "fs";

const paths = [
	"src/commands",
	"src/queries"
]

// Recursively loop over all files and folders in the paths and generate a json schema for each file's ResponseType
function generateSchemas(paths) { 
	for (const path of paths) {
		const files = fs.readdirSync(path);
		for (const file of files) {
			const filePath = `${path}/${file}`;
			const stat = fs.statSync(filePath);
			if (stat.isDirectory()) {
				generateSchemas([filePath]);
			} else {
				const config = {
					path: filePath,
					type: "ResponseType",
					tsconfig: "tsconfig.json",

				}
				const generator = createGenerator(config);
				const schema = generator.createSchema(config.type);
				const schemaString = JSON.stringify(schema, null, 2);

				const schemaPath = `${path}/${schemas}/${file.replace(".ts", ".json")}}`
				fs.writeFileSync(schemaPath, schemaString);
				return;
			}
		}
	}
}

generateSchemas(paths);

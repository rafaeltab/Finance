import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
	transform: {
		'^.+\\.ts?$':
			[
				'ts-jest',
				{
					tsconfig: './tests/tsconfig.json',
					useESM: true,
				}
			]
	},
	testEnvironment: 'node',
	testRegex: './tests/.*\\.(test|spec)?\\.(ts|tsx)$',
	extensionsToTreatAsEsm: ['.ts'],
	maxConcurrency: 1,
	maxWorkers: 1,
	testTimeout: 10000,
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	rootDir: __dirname,
	"moduleNameMapper": {
		"#src/(.*)": "<rootDir>/src/$1",
		"#tests/(.*)": "<rootDir>/tests/$1",
	},
};

export default config;
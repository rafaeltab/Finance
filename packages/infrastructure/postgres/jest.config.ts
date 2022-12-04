import { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
	transform: { '^.+\\.ts?$': 'ts-jest' },
	testEnvironment: 'node',
	testRegex: './tests/.*\\.(test|spec)?\\.(ts|tsx)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	// moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
	rootDir: __dirname,
	"moduleNameMapper": {
		"#src\/(.*)": "<rootDir>/src/$1",
		"#tests\/(.*)": "<rootDir>/tests/$1",
	},
};

export default config;
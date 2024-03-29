/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
	plugins: ['@typescript-eslint', 'import', 'prettier'],
	extends: [
		'airbnb-base',
		'airbnb-typescript/base',
		'prettier',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/typescript',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.eslint.json',
	},
	rules: require("./imports/rules.cjs"),
	ignorePatterns: [
		"**/*.js",
		"**/*.cjs",
		"**/*.mjs",
		"**/*.d.ts",
		"**/*.jsx",
		"**/migrations/**",
	],
	overrides: require("./imports/overrides.cjs")
};
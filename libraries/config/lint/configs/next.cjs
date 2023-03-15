/**
 * @type {import("eslint").Linter.Config}
*/
module.exports = {
	plugins: ['@typescript-eslint', 'import', 'prettier'],
	extends: [
		'airbnb',
		'airbnb-typescript',
		'prettier',
		'plugin:@typescript-eslint/recommended',
		'next'
	],
	rules: require("./imports/rules.cjs"),
	parser: '@typescript-eslint/parser',
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
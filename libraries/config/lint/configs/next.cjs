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
	parser: '@typescript-eslint/parser',
	ignorePatterns: [
		"**/*.js",
		"**/*.cjs",
		"**/*.mjs",
		"**/*.d.ts",
		"**/*.jsx",
		"**/migrations/**",
	]
};
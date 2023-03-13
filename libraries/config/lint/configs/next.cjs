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
	rules: {
		"import/prefer-default-export": "off",
		"import/extensions": [
			"error",
			"ignorePackages",
			{
				"js": "never",
				"jsx": "never",
				"ts": "never",
				"tsx": "never"
			}
		]
	},
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
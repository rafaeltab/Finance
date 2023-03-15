
/**
 * @type {import("eslint").Linter.ConfigOverride[]}
*/
module.exports = [
	{
		files: ["*.test.*"],
		rules: {
			"max-classes-per-file": "off",
			"@typescript-eslint/no-use-before-define": "off",
			"@typescript-eslint/no-empty-function": "off",
			"no-await-in-loop": "off"
		}
	}
]
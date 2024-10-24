/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,

	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "./tsconfig.lint.json",
		tsconfigRootDir: __dirname,
	},
};

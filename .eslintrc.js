// @ts-check
/** @type {import('@typescript-eslint/experimental-utils').TSESLint.Linter.Config} */
const config = {
	extends: [
		'plugin:@nonsugarless/core',
		'plugin:@nonsugarless/typescript',
		'plugin:@nonsugarless/prettier',
	],
	root: true,
	env: {
		node: true,
		es2021: true,
		commonjs: true,
		jest: true,
	},
	rules: {
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
			},
		],
	},
};
module.exports = config;

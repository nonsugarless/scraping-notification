// @ts-check
/** @type {import('@typescript-eslint/experimental-utils').TSESLint.Linter.Config} */
const config = {
	extends: [
		'plugin:@shopify/esnext',
		'plugin:@shopify/typescript',
		'plugin:@shopify/prettier',
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
		'@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
		'@typescript-eslint/consistent-type-imports': ['warn'],
		'@typescript-eslint/naming-convention': 'off',
	},
};
module.exports = config;

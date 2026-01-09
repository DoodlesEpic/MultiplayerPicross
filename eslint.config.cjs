const { defineConfig, globalIgnores } = require('eslint/config');

const tsParser = require('@typescript-eslint/parser');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');
const parser = require('svelte-eslint-parser');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

module.exports = defineConfig([
	{
		extends: compat.extends(
			'eslint:recommended',
			'plugin:@typescript-eslint/recommended',
			'plugin:svelte/recommended',
			'prettier'
		),

		languageOptions: {
			parser: tsParser,
			sourceType: 'module',
			ecmaVersion: 2020,

			parserOptions: {
				extraFileExtensions: ['.svelte']
			},

			globals: {
				...globals.browser,
				...globals.node
			}
		},

		plugins: {
			'@typescript-eslint': typescriptEslint
		}
	},
	{
		files: ['**/*.svelte'],

		languageOptions: {
			parser: parser,

			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	},
	globalIgnores([
		'**/.DS_Store',
		'**/node_modules',
		'build',
		'.svelte-kit',
		'package',
		'**/.env',
		'**/.env.*',
		'!**/.env.example',
		'**/pnpm-lock.yaml',
		'**/package-lock.json',
		'**/yarn.lock'
	])
]);

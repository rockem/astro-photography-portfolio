import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import astroPlugin from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		ignores: ['dist/**', '.astro/**', 'node_modules/**', '.cache/**'],
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
				sourceType: 'module',
			},
			globals: {
				...globals.node,
				...globals.browser,
			},
		},
		plugins: {
			'@typescript-eslint': ts,
		},
		rules: {
			...ts.configs.recommended.rules,
		},
	},

	{
		files: ['**/*.astro'],
		languageOptions: {
			parser: astroParser,
			parserOptions: {
				parser: tsParser,
			},
		},
		plugins: {
			astro: astroPlugin,
		},
		rules: {
			...astroPlugin.configs.recommended.rules,
		},
	},
];

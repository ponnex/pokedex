// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
	{
		// Legacy model type files are ported verbatim from the Nuxt 2 app
		ignores: [ 'app/types/**' ],
	},
	{
		rules: {
			'@stylistic/semi': [ 'error', 'always' ],
			'@stylistic/space-before-function-paren': [ 'error', 'never' ],
			'@stylistic/space-before-blocks': 'error',
			'@stylistic/quote-props': [ 'error', 'as-needed' ],
			'@stylistic/eol-last': [ 'error', 'always' ],
			'prefer-template': 'error',
			'@stylistic/comma-dangle': [ 'error', 'always-multiline' ],
			'@stylistic/array-bracket-spacing': [ 'error', 'always' ],
			'@stylistic/no-tabs': 'off',
			'@stylistic/indent': [ 'error', 'tab' ],
			'vue/html-indent': [ 'error', 'tab' ],
			'vue/html-self-closing': 'off',
			'vue/singleline-html-element-content-newline': 'off',
			'vue/no-v-html': 'off',
			// Templates are preserved verbatim from the Nuxt 2 app
			'vue/max-attributes-per-line': 'off',
			'vue/object-curly-spacing': 'off',
			'vue/quote-props': 'off',
			'vue/first-attribute-linebreak': 'off',
			// PokeAPI response models use `any` members (ported verbatim)
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
);

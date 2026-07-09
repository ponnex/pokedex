import { $fetch } from 'ofetch';
import type { PokemonListResponse } from './app/types/pokemon-list';

export default defineNuxtConfig({
	modules: [
		'@pinia/nuxt',
		'@nuxtjs/tailwindcss',
		'@nuxtjs/color-mode',
		'@vite-pwa/nuxt',
		'@nuxt/eslint',
	],

	// Disable server-side rendering (SPA, statically generated)
	ssr: false,

	// Global page headers
	app: {
		head: {
			title: 'pokedex',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'description', content: 'Discover the ultimate Pokedex PWA app for all your Pokemon needs. Get detailed data, stats, abilities, strengths, weaknesses, and evolution information. Catch \'em all!' },
			],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			],
		},
	},

	// Global CSS
	css: [
		'~/assets/styles/main.scss',
	],

	colorMode: {
		preference: 'light',
		fallback: 'system',
		classPrefix: '',
		classSuffix: '',
		storageKey: 'nuxt-color-mode',
	},

	runtimeConfig: {
		public: {
			apiBase: 'https://pokeapi.co/api/v2',
		},
	},

	compatibilityDate: '2026-07-09',

	// Static generation: one route per Pokemon name (as the Nuxt 2 generate.routes)
	hooks: {
		async 'prerender:routes'(ctx) {
			const response = await $fetch<PokemonListResponse>('https://pokeapi.co/api/v2/pokemon?limit=1118');
			ctx.routes.add('/');
			for (const pokemon of response.results) {
				ctx.routes.add(`/${pokemon.name}`);
			}
		},
	},

	eslint: {
		config: {
			stylistic: {
				indent: 'tab',
				semi: true,
				commaDangle: 'always-multiline',
			},
		},
	},

	// PWA parity with the Nuxt 2 @nuxtjs/pwa module
	pwa: {
		registerType: 'autoUpdate',
		manifest: {
			name: 'Pokédex',
			short_name: 'Pokédex',
			description: 'The Pokédex contains detailed stats for every creature from the Pokémon games',
			lang: 'en',
			icons: [
				{
					src: 'icon.png',
					sizes: '512x512',
					type: 'image/png',
				},
			],
		},
		registerWebManifestInRouteRules: true,
	},
});

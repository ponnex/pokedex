import { NuxtConfig } from '@nuxt/types';
import { ProvidePlugin, NormalModuleReplacementPlugin } from 'webpack';
import axios from 'axios';
import { Pokemon } from '@/model/pokemon';

const config: NuxtConfig = {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'pokedex',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Discover the ultimate Pokedex PWA app for all your Pokemon needs. Get detailed data, stats, abilities, strengths, weaknesses, and evolution information. Catch \'em all!' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/styles/main.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios.ts',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://github.com/danielroe/typed-vuex
    'nuxt-typed-vuex',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://color-mode.nuxtjs.org/
    '@nuxtjs/color-mode',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    meta: {
      name: 'Pokédex',
      nativeUI: true,
    },
    manifest: {
      name: 'Pokédex',
      short_name: 'Pokédex',
      description: 'The Pokédex contains detailed stats for every creature from the Pokémon games',
      lang: 'en',
    },
    con: {
      source: 'static/icon.png',
      fileName: 'app-icon.png'
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      /typed-vuex/,
    ],
    extend(config, ctx) {
      if (process.env.NODE_ENV === 'production') {
        config.plugins?.push(new NormalModuleReplacementPlugin(
          /environment\/defaults\.json/,
          '@/environment/defaults.prod.json'
        ));
      }
    },
    plugins: [
      new ProvidePlugin({
        '_': 'lodash',
      }),
    ],
  },
  colorMode: {
    preference: 'light',
    fallback: 'system',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },
  generate: {
    routes: () => {
      return axios.get('https://pokeapi.co/api/v2/pokemon?limit=1118')
      .then((response) => {
        return response.data.results.map((post: Pokemon) => {
          return '/' + post.name;
        });
      })
    },
  },
}

export default config;

module.exports = {
	safelist: [
		'bg-gray-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500',
		'bg-pink-500', 'bg-yellow-800', 'bg-gray-800', 'bg-gray-700', 'text-gray-500', 'text-red-500', 'text-yellow-500', 'text-green-500', 'text-blue-500', 'text-indigo-500', 'text-purple-500',
		'text-pink-500', 'text-yellow-800', 'text-gray-800', 'text-gray-700',
	],
	content: [
		'./app/components/**/*.{vue,js}',
		'./app/layouts/**/*.vue',
		'./app/pages/**/*.vue',
		'./app/plugins/**/*.{js,ts}',
		'./app/app.vue',
		'./nuxt.config.{js,ts}',
	],
	darkMode: 'class',
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};

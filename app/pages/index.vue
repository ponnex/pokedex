<template>
	<div class="flex flex-col h-screen max-w-screen-2xl min-h-screen mx-auto p-5 lg:px-12">
		<svg
			width="104"
			height="104"
			viewBox="0 0 104 104"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="fixed h-72 w-72 -right-16 -top-32 lg:h-96 lg:w-96 opacity-40 pointer-events-none"
		>
			<path
				opacity="0.1"
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M104 52C104 80.7188 80.7188 104 52 104C23.2812 104 0 80.7188 0 52C0 23.2812 23.2812 0 52 0C80.7188 0 104 23.2812 104 52ZM69 52C69 61.3888 61.3888 69 52 69C42.6112 69 35 61.3888 35 52C35 42.6112 42.6112 35 52 35C61.3888 35 69 42.6112 69 52ZM76 52C76 65.2548 65.2548 76 52 76C38.7452 76 28 65.2548 28 52H8C8 76.3005 27.6995 96 52 96C76.3005 96 96 76.3005 96 52H76Z"
				fill="currentColor"
			/>
		</svg>
		<header class="bg-transparent">
			<form class="py-3 space-y-4" autocomplete="off" @submit.prevent="onSearchSubmit">
				<div class="grid grid-cols-12">
					<h1 class="col-span-11 text-red-600 text-3xl font-semibold">Pokédex</h1>
					<svg
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						viewBox="0 0 24 24"
						stroke="currentColor"
						class="w-6 h-6 col-span-1 justify-self-end self-center cursor-pointer"
						@click="onChangeTheme()"
					>
						<path v-if="colorMode.preference == 'light'" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
						<path v-if="colorMode.preference == 'dark'" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
					</svg>
				</div>
				<div class="space-x-6">
					<svg
						v-if="isSearching"
						width="22"
						height="14"
						viewBox="0 0 22 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="inline-block col-span-11 cursor-pointer"
						@click="backFromSearch()"
					>
						<path
							d="M7.70711 1.70711C8.09763 1.31658 8.09763 0.683417 7.70711 0.292893C7.31658 -0.0976311 6.68342 -0.0976311 6.29289 0.292893L0.292893 6.29289C-0.097631 6.68342 -0.097631 7.31658 0.292893 7.70711L6.29289 13.7071C6.68342 14.0976 7.31658 14.0976 7.70711 13.7071C8.09763 13.3166 8.09763 12.6834 7.70711 12.2929L3.4142 7.99998H20.9892C21.5476 7.99998 22.0002 7.55227 22.0002 6.99998C22.0002 6.4477 21.5476 5.99998 20.9892 5.99998H3.41423L7.70711 1.70711Z"
							fill="currentColor"
						/>
					</svg>
					<input
						id="search-pokemon"
						ref="search-pokemon"
						v-model="searchKey"
						type="search"
						name="search-pokemon"
						placeholder="Search for a Pokémon"
						autocomplete="off"
						:class="[{'min-w-full': !isSearching}, {'w-10/12': isSearching}]"
						class="inline-block font-medium text-gray-500 dark:text-black placeholder-gray-500 dark:placeholder-gray-900 bg-gray-200 dark:bg-gray-50 rounded-2xl py-1 px-3"
						@input="onSearchInput"
					>
				</div>
				<pokemon-type-filter v-model="selectedTypes" @update:model-value="onTypesChange" />
				<span class="block md:pt-4 lg:pt-4 font-medium text-xs text-gray-500 dark:text-white">The Pokédex contains detailed stats for every creature from the Pokémon games.</span>
			</form>
		</header>
		<div v-if="!pokemonList" class="flex flex-grow justify-self-center self-center px-5">
			<div class="grid justify-self-center self-center">
				<img src="~/assets/images/pokeball_loading.gif" alt="pokeball_loading" class="h-32 justify-self-center self-center">
				<span class="justify-self-center self-center text-gray-500 dark:text-white">Loading...</span>
			</div>
		</div>
		<div v-else ref="pokemon-list" class="h-auto lg:grid-cols-3 overflow-y-auto mb-5 sm:gap-4 sm:grid sm:grid-cols-2 sm:items-center sm:space-y-0 space-y-3 xl:grid-cols-4 rounded-2xl scrollable">
			<pokemon-card
				v-for="(pokemon, pokemonIdx) in pokemonList"
				:key="pokemonIdx"
				:pokemon="pokemon"
				:details-updated="!pending"
				@click="onSelectPokemon(pokemon)"
			/>
			<div v-if="pokemonList && !pokemonList.length" class="grid justify-center space-y-4">
				<span>No Pokémon found</span>
				<button
					class="border-2 border-gray-300 p-1 px-2 rounded-xl text-sm"
					@click="onFocusSearch()"
				>
					Search Again
				</button>
			</div>
		</div>
		<div class="min-w-full bottom-0 fixed grid grid-cols-2 h-10 justify-self-center self-center gap-x-20 bg-white dark:bg-gray-900">
			<div class="h-full w-full grid-cols-1 justify-self-center self-center">
				<svg
					v-if="prevUrl"
					width="22"
					height="14"
					viewBox="0 0 22 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="h-full m-auto cursor-pointer"
					@click="prevPage()"
				>
					<path
						d="M7.70711 1.70711C8.09763 1.31658 8.09763 0.683417 7.70711 0.292893C7.31658 -0.0976311 6.68342 -0.0976311 6.29289 0.292893L0.292893 6.29289C-0.097631 6.68342 -0.097631 7.31658 0.292893 7.70711L6.29289 13.7071C6.68342 14.0976 7.31658 14.0976 7.70711 13.7071C8.09763 13.3166 8.09763 12.6834 7.70711 12.2929L3.4142 7.99998H20.9892C21.5476 7.99998 22.0002 7.55227 22.0002 6.99998C22.0002 6.4477 21.5476 5.99998 20.9892 5.99998H3.41423L7.70711 1.70711Z"
						fill="currentColor"
					/>
				</svg>
			</div>
			<div class="h-full w-full grid-cols-1 justify-self-center self-center">
				<svg
					v-if="nextUrl"
					width="22"
					height="14"
					viewBox="0 0 22 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="h-full m-auto cursor-pointer"
					@click="nextPage()"
				>
					<path
						d="M14.2931 1.70711C13.9026 1.31658 13.9026 0.683417 14.2931 0.292893C14.6837 -0.0976311 15.3168 -0.0976311 15.7074 0.292893L21.7073 6.29289C22.0979 6.68342 22.0979 7.31658 21.7073 7.70711L15.7074 13.7071C15.3168 14.0976 14.6837 14.0976 14.2931 13.7071C13.9026 13.3166 13.9026 12.6834 14.2931 12.2929L18.586 7.99998H1.01103C0.452653 7.99998 0 7.55227 0 6.99998C0 6.4477 0.452653 5.99998 1.01103 5.99998H18.586L14.2931 1.70711Z"
						fill="currentColor"
					/>
				</svg>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { PokemonList } from '~/types/pokemon-list';
import { ENDPOINTS } from '~/types/constants';

const pokemonStore = usePokemonStore();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const colorMode = useColorMode();
const { onChangeTheme } = useChangeTheme();

const searchPokemonEl = useTemplateRef<HTMLInputElement>('search-pokemon');
const pokemonListEl = useTemplateRef<HTMLElement>('pokemon-list');

const searchKey = ref('');
const isSearching = ref(false);
const selectedTypes = ref<string[]>([]);
// Local pending state (replaces the Nuxt 2 `$fetchState.pending`)
const pending = ref(true);

const pokemonList = computed(() => {
	return pokemonStore.listResponse.results;
});

const nextUrl = computed(() => {
	return pokemonStore.nextUrl;
});

const prevUrl = computed(() => {
	return pokemonStore.prevUrl;
});

const scrollListToTop = () => {
	pokemonListEl.value?.scrollTo(0, 0);
};

// Applies the current search + type filter state: syncs the URL query and
// fetches through the matching store action (filter > search > plain list)
const applyFilters = async() => {
	pending.value = true;
	const search = searchKey.value.length >= 3 ? searchKey.value : '';
	isSearching.value = !!search;
	const query: Record<string, string> = {};
	if (search) {
		query.search = search;
	}
	if (selectedTypes.value.length) {
		query.types = selectedTypes.value.join(',');
	}
	router.push({ path: '/', query });
	if (selectedTypes.value.length) {
		await pokemonStore.filterPokemonByTypes(selectedTypes.value, search || undefined);
	}
	else if (search) {
		await pokemonStore.searchPokemon(search);
	}
	else {
		await pokemonStore.getListResponse();
	}
	pending.value = false;
	scrollListToTop();
};

// Fetch on setup (replaces the Nuxt 2 non-blocking `fetch()` hook)
const fetchList = async() => {
	const { search, types } = route.query;
	if (search && (search as string).length >= 3) {
		searchKey.value = search as string;
	}
	if (typeof types === 'string' && types) {
		selectedTypes.value = types.split(',');
	}
	await applyFilters();
};

fetchList();

const onSearchSubmit = () => {
	if (searchKey.value !== '' && searchKey.value.length >= 3) {
		applyFilters();
	}
};

const onSearchInput = () => {
	if (searchKey.value === '' && isSearching.value) {
		applyFilters();
	}
};

const backFromSearch = () => {
	searchKey.value = '';
	applyFilters();
};

const onTypesChange = () => {
	applyFilters();
};

const prevPage = async() => {
	const params = prevUrl.value?.replace(`${config.public.apiBase}${ENDPOINTS.POKEMON}`, '');
	await pokemonStore.getListResponse(params);
	scrollListToTop();
};

const nextPage = async() => {
	const params = nextUrl.value?.replace(`${config.public.apiBase}${ENDPOINTS.POKEMON}`, '');
	await pokemonStore.getListResponse(params);
	scrollListToTop();
};

onActivated(() => {
	pokemonStore.setListResponse(pokemonStore.listResponse);
});

const onSelectPokemon = (pokemon: PokemonList) => {
	router.push(`/${pokemon.name}`);
};

const onFocusSearch = () => {
	nextTick(() => {
		searchPokemonEl.value?.select();
	});
	searchPokemonEl.value?.focus();
};
</script>

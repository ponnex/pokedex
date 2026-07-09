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
				<div class="flex items-center gap-x-4">
					<svg
						v-if="isSearching"
						width="22"
						height="14"
						viewBox="0 0 22 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="shrink-0 cursor-pointer"
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
						class="flex-1 min-w-0 font-medium text-gray-500 dark:text-black placeholder-gray-500 dark:placeholder-gray-900 bg-gray-200 dark:bg-gray-50 rounded-2xl py-1 px-3"
						@input="onSearchInput"
					>
					<button
						type="button"
						aria-label="Open filters"
						class="relative shrink-0 flex items-center gap-x-1.5 px-3 py-1.5 rounded-2xl cursor-pointer text-sm font-medium text-gray-600 dark:text-white bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
						@click="isSidebarOpen = true"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<line x1="4" y1="6" x2="20" y2="6" />
							<line x1="7" y1="12" x2="17" y2="12" />
							<line x1="10" y1="18" x2="14" y2="18" />
						</svg>
						Filters
						<span
							v-if="activeFilterCount"
							class="flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold"
						>
							{{ activeFilterCount }}
						</span>
					</button>
				</div>
				<pokemon-active-filters v-model="filters" @update:model-value="onFiltersChange" />
				<span class="block md:pt-4 lg:pt-4 font-medium text-xs text-gray-500 dark:text-white">The Pokédex contains detailed stats for every creature from the Pokémon games.</span>
			</form>
		</header>
		<div v-if="pending" ref="pokemon-list" class="flex-1 min-h-0 lg:grid-cols-3 overflow-y-auto mb-10 sm:gap-4 sm:grid sm:grid-cols-2 sm:content-start sm:items-center sm:space-y-0 space-y-3 xl:grid-cols-4 rounded-2xl scrollable">
			<pokemon-card-skeleton v-for="skeletonIdx in pageSize" :key="skeletonIdx" />
		</div>
		<div v-else ref="pokemon-list" class="flex-1 min-h-0 lg:grid-cols-3 overflow-y-auto mb-10 sm:gap-4 sm:grid sm:grid-cols-2 sm:content-start sm:items-center sm:space-y-0 space-y-3 xl:grid-cols-4 rounded-2xl scrollable">
			<pokemon-card
				v-for="pokemon in pokemonList"
				:key="pokemon.id"
				:pokemon="pokemon"
				@click="onSelectPokemon(pokemon)"
			/>
			<div v-if="!pokemonList.length" class="col-span-full flex flex-col items-center justify-center text-center gap-y-2 py-20 px-6">
				<svg
					class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-2"
					viewBox="0 0 104 104"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<circle cx="52" cy="52" r="17" fill="currentColor" />
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M78.3309 58H103.658C100.683 83.8926 78.6896 104 52 104C25.3104 104 3.3172 83.8926 0.342407 58H25.669C28.3974 70.0239 39.1505 79 52 79C64.8495 79 75.6026 70.0239 78.3309 58ZM78.3309 46H103.658C100.683 20.1074 78.6896 0 52 0C25.3104 0 3.3172 20.1074 0.342407 46H25.669C28.3974 33.9761 39.1505 25 52 25C64.8495 25 75.6026 33.9761 78.3309 46Z"
						fill="currentColor"
					/>
				</svg>
				<span class="text-lg font-semibold text-gray-700 dark:text-white">No Pokémon found</span>
				<span class="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{{ emptyStateMessage }}</span>
				<div class="flex flex-wrap justify-center gap-3 mt-3">
					<button
						v-if="activeFilterCount"
						type="button"
						class="px-4 py-1.5 rounded-xl cursor-pointer text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
						@click="onFiltersChange({ types: [], generations: [], categories: [], moves: [] })"
					>
						Clear filters
					</button>
					<button
						v-if="isSearching"
						type="button"
						class="px-4 py-1.5 rounded-xl cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
						@click="backFromSearch()"
					>
						Clear search
					</button>
					<button
						v-if="!isSearching && !activeFilterCount"
						type="button"
						class="px-4 py-1.5 rounded-xl cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
						@click="onFocusSearch()"
					>
						Search again
					</button>
				</div>
			</div>
		</div>
		<div class="fixed inset-x-0 bottom-0 flex h-14 pb-4 items-center justify-center gap-x-8 bg-white dark:bg-gray-900 text-gray-700 dark:text-white">
			<template v-if="!isFiltering">
				<button
					type="button"
					aria-label="Previous page"
					:disabled="!hasPrevPage"
					class="flex items-center justify-center h-full px-4 transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
					:class="hasPrevPage ? 'cursor-pointer hover:opacity-60' : 'opacity-20 cursor-default'"
					@click="prevPage()"
				>
					<svg
						width="22"
						height="14"
						viewBox="0 0 22 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							d="M7.70711 1.70711C8.09763 1.31658 8.09763 0.683417 7.70711 0.292893C7.31658 -0.0976311 6.68342 -0.0976311 6.29289 0.292893L0.292893 6.29289C-0.097631 6.68342 -0.097631 7.31658 0.292893 7.70711L6.29289 13.7071C6.68342 14.0976 7.31658 14.0976 7.70711 13.7071C8.09763 13.3166 8.09763 12.6834 7.70711 12.2929L3.4142 7.99998H20.9892C21.5476 7.99998 22.0002 7.55227 22.0002 6.99998C22.0002 6.4477 21.5476 5.99998 20.9892 5.99998H3.41423L7.70711 1.70711Z"
							fill="currentColor"
						/>
					</svg>
				</button>
				<span class="text-xs font-medium text-gray-500 dark:text-gray-300 tabular-nums" aria-live="polite">
					Page {{ page + 1 }} of {{ totalPages }}
				</span>
				<button
					type="button"
					aria-label="Next page"
					:disabled="!hasNextPage"
					class="flex items-center justify-center h-full px-4 transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
					:class="hasNextPage ? 'cursor-pointer hover:opacity-60' : 'opacity-20 cursor-default'"
					@click="nextPage()"
				>
					<svg
						width="22"
						height="14"
						viewBox="0 0 22 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							d="M14.2931 1.70711C13.9026 1.31658 13.9026 0.683417 14.2931 0.292893C14.6837 -0.0976311 15.3168 -0.0976311 15.7074 0.292893L21.7073 6.29289C22.0979 6.68342 22.0979 7.31658 21.7073 7.70711L15.7074 13.7071C15.3168 14.0976 14.6837 14.0976 14.2931 13.7071C13.9026 13.3166 13.9026 12.6834 14.2931 12.2929L18.586 7.99998H1.01103C0.452653 7.99998 0 7.55227 0 6.99998C0 6.4477 0.452653 5.99998 1.01103 5.99998H18.586L14.2931 1.70711Z"
							fill="currentColor"
						/>
					</svg>
				</button>
			</template>
			<span v-else class="text-xs font-medium text-gray-500 dark:text-gray-300 tabular-nums">
				{{ filteredList.length }} Pokémon found
			</span>
		</div>
		<pokemon-filter-sidebar
			v-model="filters"
			:open="isSidebarOpen"
			@update:model-value="onFiltersChange"
			@close="isSidebarOpen = false"
		/>
	</div>
</template>

<script setup lang="ts">
import type { PokemonIndexEntry, PokemonFilters, PokemonCategory } from '~/types/pokemon-list';

// h-24 card height; keep in sync with the card component
const CARD_HEIGHT = 96;
const MIN_PAGE_SIZE = 20;

const pokemonStore = usePokemonStore();
const route = useRoute();
const router = useRouter();
const colorMode = useColorMode();
const { onChangeTheme } = useChangeTheme();

const searchPokemonEl = useTemplateRef<HTMLInputElement>('search-pokemon');
const pokemonListEl = useTemplateRef<HTMLElement>('pokemon-list');

const searchKey = ref('');
// The applied search term (set on submit/deep-link, not on every keystroke)
const activeSearch = ref('');
const isSearching = ref(false);
const filters = ref<PokemonFilters>({ types: [], generations: [], categories: [], moves: [] });
const isSidebarOpen = ref(false);
const page = ref(0);
// Cards per page — recalculated from the list container size so a page
// always shows exactly the cards that fit without scrolling
const pageSize = ref(20);
// True only while the one-off GraphQL index loads
const pending = ref(true);

const calcPageSize = () => {
	const el = pokemonListEl.value;
	if (!el) {
		return;
	}
	const styles = getComputedStyle(el);
	const isGrid = styles.display === 'grid';
	const columns = isGrid ? styles.gridTemplateColumns.split(' ').length : 1;
	const gap = isGrid ? (parseFloat(styles.rowGap) || 16) : 12;
	const rows = Math.max(1, Math.floor((el.clientHeight + gap) / (CARD_HEIGHT + gap)));
	// At least 20 per page — smaller screens scroll within the list instead
	pageSize.value = Math.max(MIN_PAGE_SIZE, columns * rows);
};

// Keep the current page in range when a resize changes the page count
watch(pageSize, () => {
	const maxPage = Math.max(0, Math.ceil(filteredList.value.length / pageSize.value) - 1);
	if (page.value > maxPage) {
		page.value = maxPage;
	}
});

let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
const onResize = () => {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(calcPageSize, 150);
};

// Arrow keys page through the list unless the user is typing in a field
const onKeydown = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement | null;
	if (target && [ 'INPUT', 'TEXTAREA', 'SELECT' ].includes(target.tagName)) {
		return;
	}
	if (event.key === 'ArrowLeft' && hasPrevPage.value) {
		prevPage();
	}
	else if (event.key === 'ArrowRight' && hasNextPage.value) {
		nextPage();
	}
};

onMounted(() => {
	calcPageSize();
	window.addEventListener('resize', onResize);
	window.addEventListener('keydown', onKeydown);
});

onActivated(() => {
	calcPageSize();
});

onBeforeUnmount(() => {
	clearTimeout(resizeTimeout);
	window.removeEventListener('resize', onResize);
	window.removeEventListener('keydown', onKeydown);
});

const activeFilterCount = computed(() => {
	return filters.value.types.length + filters.value.generations.length
		+ filters.value.categories.length + filters.value.moves.length;
});

// Ids of Pokemon learning the selected moves are fetched per move and cached
const ensureMovePokemonIds = () => {
	filters.value.moves.forEach((move) => {
		pokemonStore.getMovePokemonIds(move);
	});
};

// Everything below derives from the in-memory index; only newly selected
// moves trigger one cached GraphQL query each. All filter groups combine as
// OR within the group: a Pokemon matches any selected value.
const filteredList = computed<PokemonIndexEntry[]>(() => {
	let list = pokemonStore.pokemonIndex;
	const { types, generations, categories, moves } = filters.value;
	if (moves.length) {
		const learnerIds = new Set(moves.flatMap(move => pokemonStore.movePokemonIds[move] ?? []));
		list = list.filter(pokemon => learnerIds.has(pokemon.id));
	}
	if (types.length) {
		list = list.filter(pokemon => types.some(type => pokemon.types.includes(type)));
	}
	if (generations.length) {
		list = list.filter(pokemon => generations.includes(pokemon.generation));
	}
	if (categories.length) {
		list = list.filter((pokemon) => {
			return categories.some((category) => {
				if (category === 'legendary') {
					return pokemon.isLegendary;
				}
				if (category === 'mythical') {
					return pokemon.isMythical;
				}
				return pokemon.isBaby;
			});
		});
	}
	if (activeSearch.value) {
		const regex = new RegExp(activeSearch.value, 'i');
		list = list.filter(pokemon => regex.test(pokemon.name));
	}
	return list;
});

// Search/filter results show all at once; only the plain list paginates
const isFiltering = computed(() => {
	return isSearching.value || activeFilterCount.value > 0;
});

const pokemonList = computed<PokemonIndexEntry[]>(() => {
	if (isFiltering.value) {
		return filteredList.value;
	}
	return filteredList.value.slice(page.value * pageSize.value, (page.value + 1) * pageSize.value);
});

const totalPages = computed(() => {
	return Math.max(1, Math.ceil(filteredList.value.length / pageSize.value));
});

const hasPrevPage = computed(() => {
	return !isFiltering.value && page.value > 0;
});

const hasNextPage = computed(() => {
	return !isFiltering.value && (page.value + 1) * pageSize.value < filteredList.value.length;
});

const emptyStateMessage = computed(() => {
	if (activeSearch.value && activeFilterCount.value) {
		return `Nothing matches “${activeSearch.value}” with the current filters. Try loosening one of them.`;
	}
	if (activeSearch.value) {
		return `Nothing matches “${activeSearch.value}”. Check the spelling or try a shorter name.`;
	}
	if (activeFilterCount.value) {
		return 'No Pokémon matches this filter combination. Try removing a filter.';
	}
	return 'Try searching for a Pokémon by name.';
});

const scrollListToTop = () => {
	pokemonListEl.value?.scrollTo(0, 0);
};

// Applies the current search + filter state and syncs the URL query
const applyFilters = () => {
	const search = searchKey.value.length >= 3 ? searchKey.value : '';
	activeSearch.value = search;
	isSearching.value = !!search;
	page.value = 0;
	const query: Record<string, string> = {};
	if (search) {
		query.search = search;
	}
	if (filters.value.types.length) {
		query.types = filters.value.types.join(',');
	}
	if (filters.value.generations.length) {
		query.gens = filters.value.generations.join(',');
	}
	if (filters.value.categories.length) {
		query.cats = filters.value.categories.join(',');
	}
	if (filters.value.moves.length) {
		query.moves = filters.value.moves.join(',');
	}
	ensureMovePokemonIds();
	router.push({ path: '/', query });
	scrollListToTop();
};

// Fetch on setup (replaces the Nuxt 2 non-blocking `fetch()` hook)
const fetchList = async() => {
	const { search, types, gens, cats, moves } = route.query;
	if (search && (search as string).length >= 3) {
		searchKey.value = search as string;
		activeSearch.value = search as string;
		isSearching.value = true;
	}
	if (typeof types === 'string' && types) {
		filters.value.types = types.split(',');
	}
	if (typeof gens === 'string' && gens) {
		filters.value.generations = gens.split(',').map(Number).filter(Boolean);
	}
	if (typeof cats === 'string' && cats) {
		filters.value.categories = cats.split(',').filter((category) => {
			return [ 'legendary', 'mythical', 'baby' ].includes(category);
		}) as PokemonCategory[];
	}
	if (typeof moves === 'string' && moves) {
		filters.value.moves = moves.split(',');
		ensureMovePokemonIds();
	}
	await pokemonStore.getPokemonIndex();
	pending.value = false;
};

fetchList();

const onSearchSubmit = () => {
	clearTimeout(searchTimeout);
	if (searchKey.value !== '' && searchKey.value.length >= 3) {
		applyFilters();
	}
};

// Live search: apply as the user types (debounced), not only on Enter
let searchTimeout: ReturnType<typeof setTimeout> | undefined;
const onSearchInput = () => {
	clearTimeout(searchTimeout);
	searchTimeout = setTimeout(() => {
		if (searchKey.value.length >= 3 || (searchKey.value === '' && isSearching.value)) {
			applyFilters();
		}
	}, 250);
};

const backFromSearch = () => {
	searchKey.value = '';
	applyFilters();
};

const onFiltersChange = (updated: PokemonFilters) => {
	filters.value = updated;
	applyFilters();
};

const prevPage = () => {
	page.value = Math.max(0, page.value - 1);
	scrollListToTop();
};

const nextPage = () => {
	page.value = page.value + 1;
	scrollListToTop();
};

const onSelectPokemon = (pokemon: PokemonIndexEntry) => {
	router.push(`/${pokemon.name}`);
};

const onFocusSearch = () => {
	nextTick(() => {
		searchPokemonEl.value?.select();
	});
	searchPokemonEl.value?.focus();
};
</script>

<template>
	<div class="max-h-screen overflow-hidden text-white">
		<div v-show="pokemon && !pending" class="flex flex-col">
			<div class="fixed w-full z-10 top-0 max-w-screen-2xl">
				<div :class="`bg-${pokemonColor()}`" :style="headerBgStyle"></div>
				<div class="details-bg" :class="`bg-${pokemonColor()}`" :style="headerCurveStyle"></div>
				<svg
					width="104"
					height="104"
					viewBox="0 0 104 104"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="fixed h-80 w-80 lg:h-96 lg:w-96 opacity-75 pointer-events-none -left-24 2xl:left-auto -top-28 "
					:style="pokeballStyle"
				>
					<path
						opacity="0.1"
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M104 52C104 80.7188 80.7188 104 52 104C23.2812 104 0 80.7188 0 52C0 23.2812 23.2812 0 52 0C80.7188 0 104 23.2812 104 52ZM69 52C69 61.3888 61.3888 69 52 69C42.6112 69 35 61.3888 35 52C35 42.6112 42.6112 35 52 35C61.3888 35 69 42.6112 69 52ZM76 52C76 65.2548 65.2548 76 52 76C38.7452 76 28 65.2548 28 52H8C8 76.3005 27.6995 96 52 96C76.3005 96 96 76.3005 96 52H76Z"
						fill="currentColor"
					/>
				</svg>
			</div>
			<div class="fixed w-full z-10 top-0 max-w-screen-2xl p-5">
				<div class="flex justify-between fill-current text-white dark:text-gray-900 max-w-screen-lg mx-auto">
					<svg
						width="22"
						height="14"
						viewBox="0 0 22 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="col-span-11 cursor-pointer"
						@click="onHome()"
					>
						<path
							d="M7.70711 1.70711C8.09763 1.31658 8.09763 0.683417 7.70711 0.292893C7.31658 -0.0976311 6.68342 -0.0976311 6.29289 0.292893L0.292893 6.29289C-0.097631 6.68342 -0.097631 7.31658 0.292893 7.70711L6.29289 13.7071C6.68342 14.0976 7.31658 14.0976 7.70711 13.7071C8.09763 13.3166 8.09763 12.6834 7.70711 12.2929L3.4142 7.99998H20.9892C21.5476 7.99998 22.0002 7.55227 22.0002 6.99998C22.0002 6.4477 21.5476 5.99998 20.9892 5.99998H3.41423L7.70711 1.70711Z"
							fill="currentColor"
						/>
					</svg>
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
				<div class="mt-6 flex flex-col leading-none max-w-screen-lg mx-auto" :style="headerTitleStyle">
					<div class="inline-grid grid-cols-3">
						<span class="col-span-2 font-bold text-3xl">{{ pokemon ? startCase(pokemon.name) : '' }}</span>
						<span class="col-span-1 text-white dark:text-gray-900 opacity-75 font-bold justify-self-end self-center text-4xl">{{ pokemon ? `#${padStart(String(pokemon.id), 3, '0')}`: '' }}</span>
					</div>
					<pokemon-type-badge
						:types="pokemonTypes"
					/>
					<img
						:src="pokemonImage"
						:alt="pokemon ? pokemon.name: ''"
						class="h-40 w-40 -mt-16 justify-self-center self-center"
						:style="pokemonImageStyle"
					>
				</div>
			</div>
			<div class="z-0 max-w-screen-2xl flex flex-col h-screen p-5 w-screen" :style="contentStyle">
				<div v-if="pokemon" class="no-scrollbar text-gray-700 dark:text-white overflow-auto flex-grow flex flex-col space-y-8 max-w-screen-lg mx-auto pb-10 w-full" @scroll.passive="onScroll">
					<div class="flex flex-col items-center justify-center mt-14 space-y-3">
						<span class="break-words text-center text-sm leading-relaxed max-w-lg">{{ pokemon.description }}</span>
						<pokemon-type-badge
							:types="pokemonTypes"
							:full="true"
						/>
					</div>
					<section>
						<h2 class="font-black text-xl" :class="`text-${pokemonColor()}`">Pokédex Data</h2>
						<div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
							<div v-for="(entry, entryIdx) in pokedexData" :key="entryIdx" class="rounded-xl bg-gray-100 dark:bg-gray-800 p-3">
								<span class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{{ entry.label }}</span>
								<span class="block mt-1 text-sm font-black" :class="`text-${pokemonColor()}`">{{ entry.value }}</span>
							</div>
						</div>
					</section>
					<section>
						<h2 class="font-black text-xl" :class="`text-${pokemonColor()}`">Base Stats</h2>
						<div class="mt-4 space-y-3 text-xs">
							<div v-for="(stats, statsIdx) in pokemon.stats" :key="statsIdx" class="grid grid-cols-12 items-center gap-2">
								<span class="col-span-4 md:col-span-3 font-bold text-gray-500 dark:text-gray-400">{{ stats.name !== 'hp' ? startCase(stats.name) : 'HP' }}</span>
								<span class="col-span-1 font-black text-right tabular-nums">{{ stats.baseStat }}</span>
								<pokemon-stats-bar
									:stat="stats.baseStat"
									:bar-color="pokemonColor()"
									class="col-span-7 md:col-span-8"
								/>
							</div>
							<div class="grid grid-cols-12 items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
								<span class="col-span-4 md:col-span-3 font-black">Total</span>
								<span class="col-span-1 font-black text-right tabular-nums" :class="`text-${pokemonColor()}`">{{ statTotal }}</span>
							</div>
						</div>
					</section>
					<section>
						<h2 class="font-black text-xl" :class="`text-${pokemonColor()}`">Abilities</h2>
						<div class="mt-4 space-y-3">
							<div v-for="(ability, abilityIdx) in pokemon.abilities" :key="abilityIdx" class="rounded-xl bg-gray-100 dark:bg-gray-800 p-4">
								<span class="font-black text-xs" :class="`text-${pokemonColor()}`">{{ startCase(ability.name) }}</span>
								<p class="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-300">{{ ability.effect }}</p>
							</div>
						</div>
					</section>
					<section>
						<h2 class="font-black text-xl" :class="`text-${pokemonColor()}`">Type Matchups</h2>
						<div class="grid md:grid-cols-2 gap-6 mt-4">
							<div class="rounded-xl bg-gray-100 dark:bg-gray-800 p-4">
								<span class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Strength · deals</span>
								<pokemon-damage-relation
									:relations="pokemon.strength"
								/>
							</div>
							<div class="rounded-xl bg-gray-100 dark:bg-gray-800 p-4">
								<span class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Weakness · takes</span>
								<pokemon-damage-relation
									:relations="pokemon.weakness"
								/>
							</div>
						</div>
					</section>
					<section>
						<h2 class="font-black text-xl" :class="`text-${pokemonColor()}`">Evolution</h2>
						<div v-if="evolutionStages.length" class="flex flex-col items-center mt-4 space-y-6">
							<div v-for="(evolutionStage, evolutionStageIdx) in evolutionStages" :key="evolutionStageIdx">
								<pokemon-evolution-stage
									:evolution-stage="evolutionStage"
									:pokemon-color="pokemonColor()"
								/>
							</div>
						</div>
						<p v-else class="mt-4 text-sm text-center" :class="`text-${pokemonColor()}`">This Pokémon does not evolve.</p>
					</section>
					<section>
						<h2 class="font-black text-xl" :class="`text-${pokemonColor()}`">Moves</h2>
						<div class="flex flex-wrap gap-2 mt-4">
							<span v-for="(move, moveIdx) in pokemon.moves" :key="moveIdx" class="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[11px] font-semibold text-gray-600 dark:text-gray-300">{{ startCase(move) }}</span>
						</div>
					</section>
				</div>
			</div>
		</div>
		<div v-show="!pokemon && pending" class="grid min-h-screen flex-grow justify-self-center self-center">
			<div class="grid justify-self-center self-center">
				<img src="~/assets/images/pokeball_loading.gif" alt="pokeball_loading" class="h-32 justify-self-center self-center">
				<span class="justify-self-center self-center text-gray-500 dark:text-white">Loading...</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { padStart, startCase } from 'lodash-es';
import type { Type } from '~/types/pokemon';

// Match Nuxt 2 keep-alive semantics: one cached page instance per path
definePageMeta({
	key: route => route.path,
});

const pokemonStore = usePokemonStore();
const route = useRoute();
const router = useRouter();
const colorMode = useColorMode();
const { onChangeTheme } = useChangeTheme();

// Local pending state (replaces the Nuxt 2 `$fetchState.pending`)
const pending = ref(true);

const pathMatch = computed(() => {
	const { slug } = route.params;
	return Array.isArray(slug) ? slug.join('/') : slug as string;
});

const pokemon = computed(() => {
	if (!pathMatch.value) {
		return;
	}
	return pokemonStore.pokemonDetails[pathMatch.value.replace('/', '')];
});

const pokemonTypes = computed<Type[]>(() => {
	return (pokemon.value?.types ?? []).map((name, slot) => {
		return { slot: slot + 1, type: { name, url: '' } } as Type;
	});
});

const pokemonImage = computed(() => {
	return pokemon.value ? officialArtworkUrl(pokemon.value.id) : '';
});

const evolutionStages = computed(() => {
	return pokemon.value?.evolutionStages ?? [];
});

const pokedexData = computed(() => {
	if (!pokemon.value) {
		return [];
	}
	return [
		{ label: 'Height', value: `${pokemon.value.height / 10} m` },
		{ label: 'Weight', value: `${pokemon.value.weight / 10} kg` },
		{ label: 'Gender', value: pokemonGender() },
		{ label: 'Growth Rate', value: pokemonGrowthRate() },
		{ label: 'Base Exp', value: String(pokemon.value.baseExperience ?? '—') },
		{ label: 'Rarity', value: pokemonRarity() },
	];
});

const statTotal = computed(() => {
	return (pokemon.value?.stats ?? []).reduce((total, stat) => total + stat.baseStat, 0);
});

// Scroll-linked header: the colored banner, title, and artwork shrink as the
// content container scrolls, and the pokeball watermark drifts at a slower
// rate for a parallax effect. All bindings are transform/height driven off
// one scrollTop ref — no transitions, so they track the finger exactly.
const HEADER_HEIGHT = 224; // h-56
const HEADER_MIN_HEIGHT = 108;
const SHRINK_DISTANCE = 160; // px of scroll over which the header collapses

const scrollTop = ref(0);

const onScroll = (event: Event) => {
	scrollTop.value = (event.target as HTMLElement).scrollTop;
};

const shrink = computed(() => {
	return Math.min(scrollTop.value / SHRINK_DISTANCE, 1);
});

const headerHeight = computed(() => {
	return HEADER_HEIGHT - (HEADER_HEIGHT - HEADER_MIN_HEIGHT) * shrink.value;
});

const headerBgStyle = computed(() => {
	return { height: `${headerHeight.value}px` };
});

// The curved lip hugs the bottom edge of the banner (its 50px height overlaps
// the last 8px, matching the original h-56 / top-13.5rem relationship)
const headerCurveStyle = computed(() => {
	return { top: `${headerHeight.value - 8}px` };
});

// Content wrapper's top padding follows the live banner height (replaces the
// static pt-56) — otherwise a 224px gap stays reserved under the collapsed
// header and shows as invisible padding while scrolling
const contentStyle = computed(() => {
	return { paddingTop: `${headerHeight.value}px` };
});

const pokeballStyle = computed(() => {
	return {
		transform: `translateY(${-Math.min(scrollTop.value * 0.25, 140)}px)`,
		willChange: 'transform',
	};
});

const headerTitleStyle = computed(() => {
	return {
		transform: `translateY(${-16 * shrink.value}px) scale(${1 - 0.15 * shrink.value})`,
		transformOrigin: 'top center',
		willChange: 'transform',
	};
});

const pokemonImageStyle = computed(() => {
	return {
		transform: `translateY(${-24 * shrink.value}px) scale(${1 - 0.45 * shrink.value})`,
		transformOrigin: 'top center',
		willChange: 'transform',
	};
});

// Fetch on setup (replaces the Nuxt 2 non-blocking `fetch()` hook) —
// one GraphQL call covers pokemon, species, abilities, damage relations,
// and the evolution chain
const fetchPokemonDetails = async() => {
	pending.value = true;
	if (!pokemon.value) {
		await pokemonStore.getPokemonDetails(pathMatch.value.replace('/', ''));
	}
	pending.value = false;
};

fetchPokemonDetails();

const pokemonColor = () => {
	const color = pokemon.value?.color || 'gray';
	if (color === 'white') {
		return 'gray-500';
	}
	else if (color === 'brown') {
		return 'yellow-800';
	}
	else if (color === 'black') {
		return colorMode.preference === 'light' ? 'gray-800' : 'gray-500';
	}
	else {
		return `${color}-500`;
	}
};

const pokemonGrowthRate = () => {
	return pokemon.value?.growthRate ? startCase(pokemon.value.growthRate) : 'Unknown';
};

const pokemonRarity = () => {
	if (!pokemon.value) {
		return 'Unknown';
	}
	if (pokemon.value.isLegendary) {
		return 'Legendary';
	}
	else if (pokemon.value.isMythical) {
		return 'Mythical';
	}
	else {
		return 'Normal';
	}
};

const pokemonGender = () => {
	if (pokemon.value && pokemon.value.genderRate !== -1) {
		return 'Male / Female';
	}
	else {
		return 'Unknown';
	}
};

const onHome = () => {
	router.push('/');
};
</script>

<style lang="scss" scoped>
.details-bg {
	display: block;
	position: absolute;
	width: 100%;
	height: 50px;
	border-bottom-left-radius: 50%;
	border-bottom-right-radius: 50%;
	top: 13.5rem;
}
.details-container {
	-webkit-scroll-snap-type: mandatory;
	-webkit-scroll-snap-type: x mandatory;
	-webkit-scroll-snap-points-y: repeat(100vw);
	scroll-snap-type: x mandatory;
	scroll-snap-points-y: repeat(100vw);
	-webkit-overflow-scrolling: touch;
	scroll-behavior: smooth;
}
.details-section {
	min-width: 100%;
	overflow: auto;
	scroll-snap-align: start;
	scroll-snap-stop: always;
	width: 100%;
	margin-right: 15px;
}
</style>

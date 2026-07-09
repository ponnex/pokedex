<template>
	<div ref="card-root">
		<div
			v-if="pokemonSpecies && !pending"
			class="relative inline-grid grid-cols-3 gap-x-4 rounded-2xl min-w-full h-24 2xl:h-44 text-white dark:text-black shadow cursor-pointer"
			:class="getBgColor()"
			@click="event => emit('click', event)"
		>
			<div class="justify-self-center self-center col-span-1">
				<svg
					v-show="!isImageLoaded"
					class="fill-current h-full p-3"
					width="104"
					height="104"
					viewBox="0 0 104 104"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle cx="52" cy="52" r="17" fill="currentColor" />
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M78.3309 58H103.658C100.683 83.8926 78.6896 104 52 104C25.3104 104 3.3172 83.8926 0.342407 58H25.669C28.3974 70.0239 39.1505 79 52 79C64.8495 79 75.6026 70.0239 78.3309 58ZM78.3309 46H103.658C100.683 20.1074 78.6896 0 52 0C25.3104 0 3.3172 20.1074 0.342407 46H25.669C28.3974 33.9761 39.1505 25 52 25C64.8495 25 75.6026 33.9761 78.3309 46Z"
						fill="currentColor"
					/>
				</svg>
				<img
					v-if="pokemonImage()"
					ref="pokemon-image"
					class="h-24 2xl:h-40 p-2 object-contain"
					:class="{ 'absolute opacity-0': !isImageLoaded }"
					:src="pokemonImage()"
					:alt="pokemon.name"
					loading="lazy"
					decoding="async"
					@load="onImageLoad()"
				>
			</div>
			<div class="flex flex-col col-span-2">
				<span class="text-2xl font-medium pt-2">{{ startCase(pokemon.name) }}</span>
				<pokemon-type-badge
					:types="pokemonTypes()"
					:text-only="true"
				/>
			</div>
			<span class="absolute bottom-0 dark:text-gray-900 font-semibold leading-9 opacity-50 right-0 text-5xl text-white">{{ pokemonDetails ? `#${padStart(String(pokemonDetails.id), 3, '0')}` : '' }}</span>
		</div>
		<div
			v-else
			class="bg-white cursor-pointer dark:bg-gray-800 dark:text-black gap-x-4 grid-cols-4 2xl:grid-cols-3 inline-grid min-w-full h-24 2xl:h-44 p-4 relative rounded-2xl shadow text-white"
		>
			<div class="2xl:h-20 2xl:w-20 bg-gray-200 col-span-1 dark:bg-gray-700 h-16 justify-self-center p-2 rounded self-center w-16"></div>
			<div class="flex flex-col col-span-3 2xl:col-span-2">
				<div :class="varyingSkeletonNameWidth"></div>
				<div class="flex space-x-2 mt-3">
					<div v-for="(skeletonType, skeletonTypeIdx) in randomSkeletonTypeCount" :key="skeletonTypeIdx" class="2xl:h-6 2xl:w-6 bg-gray-100 dark:bg-gray-700 flex gap-x-1 h-5 p-1 rounded-full self-center w-5"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { padStart, startCase } from 'lodash-es';
import type { PropType } from 'vue';
import type { PokemonList } from '~/types/pokemon-list';
import type { Pokemon } from '~/types/pokemon';
import type { PokemonSpecies } from '~/types/pokemon-species';

const props = defineProps({
	pokemon: {
		type: Object as PropType<PokemonList>,
		default: () => { return {} as PokemonList; },
	},
	detailsUpdated: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits([ 'click' ]);

const pokemonStore = usePokemonStore();
const colorMode = useColorMode();

const isImageLoaded = ref(false);
// Local pending state (replaces the Nuxt 2 `$fetchState.pending`)
const pending = ref(true);

const pokemonDetails = computed<Pokemon | undefined>(() => {
	return pokemonStore.pokemonByName.get(props.pokemon.name);
});

const pokemonSpecies = computed<PokemonSpecies | undefined>(() => {
	return pokemonStore.pokemonSpeciesByName.get(props.pokemon.name);
});

const randomSkeletonTypeCount = computed<number>(() => {
	return getRandomIntInclusive(1, 3);
});

const varyingSkeletonNameWidth = computed<string>(() => {
	return `2xl:h-6 bg-gray-100 dark:bg-gray-700 font-medium h-5 rounded text-2xl w-${getRandomIntInclusive(6, 11)}/12`;
});

const pokemonImage = () => {
	return pokemonDetails.value ? spriteUrl(pokemonDetails.value.sprites.other.officialArtwork.frontDefault) : '';
};

const pokemonTypes = () => {
	return pokemonDetails.value ? pokemonDetails.value.types : [];
};

const cardRootEl = useTemplateRef<HTMLElement>('card-root');
// Cards only fetch once scrolled near the viewport — fetching all cards on
// mount floods PokeAPI with hundreds of requests on filtered/searched lists
const isVisible = ref(false);
let observer: IntersectionObserver | undefined;

const fetchPokemon = async() => {
	// Already cached (e.g. card reused across pagination) — skip the skeleton flash
	if (pokemonDetails.value && pokemonSpecies.value) {
		pending.value = false;
		return;
	}
	pending.value = true;
	if (props.pokemon) {
		await Promise.all([
			pokemonStore.getPokemon(props.pokemon.name),
			pokemonStore.getPokemonSpecies(props.pokemon.name),
		]);
	}
	pending.value = false;
};

watch([ () => props.pokemon, isVisible ], () => {
	if (isVisible.value) {
		fetchPokemon();
	}
}, { immediate: true });

onMounted(() => {
	observer = new IntersectionObserver((entries) => {
		if (entries.some(entry => entry.isIntersecting)) {
			isVisible.value = true;
			observer?.disconnect();
		}
	}, { rootMargin: '300px' });
	if (cardRootEl.value) {
		observer.observe(cardRootEl.value);
	}
});

onBeforeUnmount(() => {
	observer?.disconnect();
});

const getBgColor = () => {
	const color = pokemonSpecies.value ? pokemonSpecies.value.color ? pokemonSpecies.value.color.name : 'gray' : 'gray';
	if (!color) {
		return;
	}
	if (color === 'white') {
		return 'bg-gray-500';
	}
	else if (color === 'brown') {
		return 'bg-yellow-800';
	}
	else if (color === 'black') {
		return colorMode.preference === 'light' ? 'bg-gray-800' : 'bg-gray-700';
	}
	else {
		return color ? `bg-${color}-500` : '';
	}
};

const onImageLoad = () => {
	isImageLoaded.value = true;
};
</script>

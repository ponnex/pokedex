<template>
	<div class="grid grid-cols-8">
		<NuxtLink
			:to="`/${evolutionStage.evolveFrom.species.name}`"
			class="col-span-3 h-28 justify-self-start self-center w-28 cursor-pointer"
		>
			<img
				:src="pokemonImage(evolutionStage.evolveFrom.species.name)"
				:alt="evolutionStage.evolveFrom.species.name"
			>
		</NuxtLink>
		<div class="grid grid-rows-2 col-span-2 gap-y-2">
			<span class="justify-self-center self-end text-xs" :class="`text-${pokemonColor}`">Level {{ evolutionStage.evolveTo.evolutionDetails[0]?.minLevel }}</span>
			<div class="bg-gray-300 dark:bg-gray-600 h-1 rounded-sm"></div>
		</div>
		<NuxtLink
			:to="`/${evolutionStage.evolveTo.species.name}`"
			class="col-span-3 h-28 justify-self-start self-center w-28 cursor-pointer"
		>
			<img
				:src="pokemonImage(evolutionStage.evolveTo.species.name)"
				:alt="evolutionStage.evolveTo.species.name"
			>
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
import { find } from 'lodash-es';
import type { PropType } from 'vue';
import type { EvolvesTo } from '~/types/pokemon-evolution-chain';
import type { Pokemon } from '~/types/pokemon';

interface EvolutionStage {
	evolveFrom: EvolvesTo;
	evolveTo: EvolvesTo;
}

const props = defineProps({
	evolutionStage: {
		type: Object as PropType<EvolutionStage>,
		default: () => { return {} as EvolutionStage; },
	},
	pokemonColor: {
		type: String,
		default: '',
	},
});

const pokemonStore = usePokemonStore();

const pokemonImage = (pokemon: string): string => {
	const fetchedPokemon: Pokemon | undefined = find(pokemonStore.pokemon, (fetchPokemon: Pokemon) => {
		return fetchPokemon.name === pokemon;
	});
	if (!fetchedPokemon) {
		return '';
	}
	return spriteUrl(fetchedPokemon.sprites.other.officialArtwork.frontDefault);
};

// Fetch on setup (replaces the Nuxt 2 non-blocking `fetch()` hook)
const fetchStagePokemon = async() => {
	await pokemonStore.getPokemon(props.evolutionStage.evolveFrom.species.name);
	await pokemonStore.getPokemon(props.evolutionStage.evolveTo.species.name);
};

fetchStagePokemon();
</script>

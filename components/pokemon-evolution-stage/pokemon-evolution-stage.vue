<template>
	<div class="grid grid-cols-8">
		<n-link
			tag="a"
			:to="`/${evolutionStage.evolveFrom.species.name}`"
			class="col-span-3 h-28 justify-self-start self-center w-28 cursor-pointer"
		>
			<img
				:src="pokemonImage(evolutionStage.evolveFrom.species.name)"
				:alt="evolutionStage.evolveFrom.species.name"
			>
		</n-link>
		<div class="grid grid-rows-2 col-span-2 gap-y-2">
			<span class="justify-self-center self-end text-xs" :class="`text-${pokemonColor}`">Level {{ evolutionStage.evolveTo.evolutionDetails[0].minLevel }}</span>
			<div class="bg-gray-300 dark:bg-gray-600 h-1 rounded-sm"></div>
		</div>
		<n-link
			tag="a"
			:to="`/${evolutionStage.evolveTo.species.name}`"
			class="col-span-3 h-28 justify-self-start self-center w-28 cursor-pointer"
		>
			<img
				:src="pokemonImage(evolutionStage.evolveTo.species.name)"
				:alt="evolutionStage.evolveTo.species.name"
			>
		</n-link>
	</div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator';
import IdFromUrl from '@/utils/id-from-url';
import { EvolvesTo } from '@/model/pokemon-evolution-chain';
import { Pokemon } from '@/model/pokemon';
declare const _: any;

interface EvolutionStage {
	evolveFrom: EvolvesTo,
	evolveTo: EvolvesTo,
}

@Component
export default class PokemonEvolutionStage extends mixins(IdFromUrl) {
	@Prop({
		type: Object,
		default: () => { return {}; },
	}) evolutionStage!: EvolutionStage;

	@Prop({
		type: String,
		default: '',
	}) pokemonColor!: string;

	pokemonImage(pokemon: string): string {
		const fetchedPokemon: Pokemon = _.find(this.$accessor.pokemon.pokemon, (fetchPokemon: Pokemon) => {
			return fetchPokemon.name === pokemon;
		});
		if (!fetchedPokemon) {
			return '';
		}
		return fetchedPokemon.sprites.other.officialArtwork.frontDefault;
	}

	async fetch() {
		await this.$accessor.pokemon.getPokemon(this.evolutionStage.evolveFrom.species.name);
		await this.$accessor.pokemon.getPokemon(this.evolutionStage.evolveTo.species.name);
	}
}
</script>

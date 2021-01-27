<template>
	<div
		class="relative inline-grid grid-cols-3 gap-x-4 rounded-2xl min-w-full h-24 text-white dark:text-black shadow-md cursor-pointer"
		:class="getBgColor()"
		@click="event => this.$emit('click', event)"
	>
		<svg
			v-if="$fetchState.pending"
			class="fill-current h-full p-3 justify-self-center self-center col-span-1"
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
		<img v-else ref="pokemon-image" class="h-24 p-2 justify-self-center self-center col-span-1" :src="pokemonImage()" :alt="pokemon.name">
		<div class="flex flex-col col-span-2">
			<span class="text-2xl font-medium pt-2">{{ startCase(pokemon.name) }}</span>
			<pokemon-type-badge
				:types="pokemonTypes()"
			/>
		</div>
		<span v-if="!$fetchState.pending" class="absolute bottom-0 dark:text-gray-900 font-semibold leading-9 opacity-50 right-0 text-5xl text-white">{{ pokemonDetails ? `#${padStart(pokemonDetails.id, 3, '0')}` : '' }}</span>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { PokemonList } from '@/model/pokemon-list';
import { Pokemon } from '@/model/pokemon';
import { PokemonSpecies } from '@/model/pokemon-species';

declare const _: any;

@Component
export default class PokemonCard extends Vue {
	@Prop({
		type: Object,
		default: () => { return {}; },
	}) pokemon!: PokemonList;

	startCase: Function = _.startCase;
	padStart: Function = _.padStart;
	pokemonDetails!: Pokemon | undefined;
	pokemonSpecies!: PokemonSpecies | undefined;

	pokemonImage() {
		return this.pokemonDetails ? this.pokemonDetails.sprites.other.officialArtwork.frontDefault : '';
	}

	pokemonTypes() {
		return this.pokemonDetails ? this.pokemonDetails.types : [];
	}

	async fetch() {
		if (this.pokemon) {
			this.pokemonDetails = await this.$accessor.pokemon.getPokemon(this.pokemon.name);
			this.pokemonSpecies = await this.$accessor.pokemon.getPokemonSpecies(this.pokemon.name);
		}
	}

	getBgColor() {
		const color = this.pokemonSpecies ? this.pokemonSpecies.color.name : 'gray';
		if (color === 'white') {
			return 'bg-gray-500';
		} else if (color === 'brown') {
			return 'bg-yellow-800';
		} else if (color === 'black') {
			return this.$colorMode.preference === 'light' ? 'bg-gray-800' : 'bg-gray-700';
		} else {
			return color ? `bg-${color}-500` : '';
		}
	}
}
</script>

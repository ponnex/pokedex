<template>
	<div>
		<div
			v-show="pokemonSpecies && !$fetchState.pending"
			class="relative inline-grid grid-cols-3 gap-x-4 rounded-2xl min-w-full h-24 2xl:h-auto text-white dark:text-black shadow cursor-pointer"
			:class="getBgColor()"
			@click="event => this.$emit('click', event)"
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
					v-show="isImageLoaded"
					ref="pokemon-image"
					class="h-24 2xl:h-auto p-2"
					:src="pokemonImage()"
					:alt="pokemon.name"
					@load="onImageLoad()"
				>
			</div>
			<div class="flex flex-col col-span-2">
				<span class="text-2xl font-medium pt-2">{{ startCase(pokemon.name) }}</span>
				<pokemon-type-badge
					:types="pokemonTypes()"
				/>
			</div>
			<span class="absolute bottom-0 dark:text-gray-900 font-semibold leading-9 opacity-50 right-0 text-5xl text-white">{{ pokemonDetails ? `#${padStart(pokemonDetails.id, 3, '0')}` : '' }}</span>
		</div>
		<div
			v-if="!pokemonSpecies && $fetchState.pending"
			class="bg-white cursor-pointer dark:bg-gray-800 dark:text-black gap-x-4 grid-cols-4 2xl:grid-cols-3 inline-grid min-w-full p-4 relative rounded-2xl shadow text-white"
		>
			<div class="2xl:h-20 2xl:w-20 bg-gray-200 col-span-1 dark:bg-gray-700 h-16 justify-self-center p-2 rounded self-center w-16"></div>
			<div class="flex flex-col col-span-3 2xl:col-span-2">
				<div class="2xl:h-6 bg-gray-100 dark:bg-gray-700 font-medium h-5 rounded text-2xl w-11/12"></div>
				<div class="flex space-x-2 mt-3">
					<div class="2xl:h-6 2xl:w-6 bg-gray-100 dark:bg-gray-700 flex gap-x-1 h-5 p-1 rounded-full self-center w-5"></div>
					<div class="2xl:h-6 2xl:w-6 bg-gray-100 dark:bg-gray-700 flex gap-x-1 h-5 p-1 rounded-full self-center w-5"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator';
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
	isImageLoaded: boolean = false;

	@Watch('pokemon')
	onPokemonChanged() {
		this.$fetch();
	}

	get pokemonDetails(): Pokemon {
		const pokemon = this.$accessor.pokemon.pokemon;
		return _.find(pokemon, (pokemon: Pokemon) => {
			return this.pokemon.name === pokemon.name;
		});
	}

	get pokemonSpecies(): PokemonSpecies {
		const species = this.$accessor.pokemon.pokemonSpecies;
		return _.find(species, (pokemon: PokemonSpecies) => {
			return this.pokemon.name === pokemon.name;
		});
	}

	pokemonImage() {
		return this.pokemonDetails ? this.pokemonDetails.sprites.other.officialArtwork.frontDefault : '';
	}

	pokemonTypes() {
		return this.pokemonDetails ? this.pokemonDetails.types : [];
	}

	async fetch() {
		if (this.pokemon) {
			await this.$accessor.pokemon.getPokemon(this.pokemon.name);
			await this.$accessor.pokemon.getPokemonSpecies(this.pokemon.name);
		}
	}

	getBgColor() {
		const color = this.pokemonSpecies ? this.pokemonSpecies.color ? this.pokemonSpecies.color.name : 'gray' : 'gray';
		if (!color) {
			return;
		}
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

	onImageLoad() {
		this.isImageLoaded = true;
	}
}
</script>

<template>
	<div class="block max-w-screen-2xl mx-auto">
		<div class="space-y-4 sticky top-0 z-10 bg-white dark:bg-black pt-4 pb-2">
			<div class="grid grid-cols-12">
				<h1 class="col-span-11 text-red-400 text-3xl font-semibold">Pokédex</h1>
				<svg
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					viewBox="0 0 24 24"
					stroke="currentColor"
					class="w-6 h-6 col-span-1 justify-self-end self-center"
					@click="onChangeTheme()"
				>
					<path v-if="$colorMode.preference == 'light'" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
					<path v-if="$colorMode.preference == 'dark'" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
				</svg>
			</div>
			<input
				id="search-pokemon"
				type="search"
				name="search-pokemon"
				placeholder="Search for a Pokémon"
				class="block font-medium min-w-full text-gray-500 dark:text-black placeholder-gray-500 dark:placeholder-gray-900 bg-gray-200 dark:bg-gray-50 rounded-2xl py-1 px-3 mr-2"
				@input="event => onSearch(event)"
			>
		</div>
		<span class="block pb-4 md:pt-4 md:pb-4 lg:pt-4 lg:pb-8 font-medium text-sm text-gray-500 dark:text-white">The Pokédex contains detailed stats for every creature from the Pokémon games.</span>
		<div class="block space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4 sm:items-center">
			<pokemon-card
				v-for="(pokemon, pokemonIdx) in pokemonList"
				:key="pokemonIdx"
				:pokemon="pokemon"
				:details-updated="detailsUpdated"
				@click="onSelectPokemon(pokemon)"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator';
import { Result } from '@/model/pokemon-list';

declare const _: any;

@Component
export default class IndexPage extends Vue {
	detailsUpdated: boolean = false;
	onSearch!: Function;

	@Watch('$fetchState.pending')
	async onFetchStatePendingChanged(pending: boolean) {
		if (!pending) {
			await this.$accessor.pokemon.getPokemonImagesForListing();
			this.detailsUpdated = true;
		}
	}

	get pokemonList() {
		return this.$accessor.pokemon.listing.results;
	}

	async fetch() {
		await this.$accessor.pokemon.getListing();
	}

	async mounted() {
		this.onSearch = await _.debounce(async(event: any) => {
			const inputEl = event.target as HTMLInputElement;
			const searchKey = inputEl.value;
			if (searchKey !== '') {
				this.detailsUpdated = false;
				await this.$accessor.pokemon.searchPokemon(searchKey);
				this.detailsUpdated = true;
			} else {
				this.detailsUpdated = false;
				this.$fetch();
			}
		}, 500);
	}

	activated() {
		// On page revisit, call fetch again if last fetch is more than 30 sec ago
		if (this.$fetchState.timestamp <= Date.now() - 30000) {
			this.$fetch();
		}
	}

	onChangeTheme() {
		this.$colorMode.preference === 'light' ? this.$colorMode.preference = 'dark' : this.$colorMode.preference = 'light';
	}

	onSelectPokemon(pokemon: Result) {
		this.$router.push(`/${pokemon.name}`);
	}
}
</script>

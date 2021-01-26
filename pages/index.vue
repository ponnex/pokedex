<template>
	<div class="flex flex-col h-full max-w-screen-2xl mx-auto">
		<header class="sticky flex-none top-0 z-10 bg-white dark:bg-gray-900 py-3 space-y-3">
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
					<path v-if="$colorMode.preference == 'light'" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
					<path v-if="$colorMode.preference == 'dark'" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
				</svg>
			</div>
			<input
				id="search-pokemon"
				ref="search-pokemon"
				type="search"
				name="search-pokemon"
				placeholder="Search for a Pokémon"
				class="block font-medium min-w-full text-gray-500 dark:text-black placeholder-gray-500 dark:placeholder-gray-900 bg-gray-200 dark:bg-gray-50 rounded-2xl py-1 px-3"
				@input="event => onSearch(event)"
			>
			<span class="block md:pt-4 lg:pt-4 font-medium text-sm text-gray-500 dark:text-white">The Pokédex contains detailed stats for every creature from the Pokémon games.</span>
		</header>
		<div class="block flex-1 py-4 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4 sm:items-center">
			<pokemon-card
				v-for="(pokemon, pokemonIdx) in pokemonList"
				:key="pokemonIdx"
				:pokemon="pokemon"
				:details-updated="detailsUpdated"
				@click="onSelectPokemon(pokemon)"
			/>
			<div v-if="pokemonList && !pokemonList.length" class="flex flex-col h-full items-center justify-center space-y-4">
				<span>No Pokémon found</span>
				<button
					class="border-2 border-gray-300 p-1 px-2 rounded-xl text-sm"
					@click="onFocusSearch()"
				>
					Search Again
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Watch, Ref, mixins } from 'nuxt-property-decorator';
import { Result } from '@/model/pokemon-list';
import ChangeTheme from '@/utils/change-theme';
declare const _: any;

@Component
export default class IndexPage extends mixins(ChangeTheme) {
	@Ref('search-pokemon') searchPokemonEl!: HTMLInputElement;
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
		const mainEl = document.querySelector('main') as HTMLElement;
		if (mainEl && !mainEl.classList.contains('p-5')) {
			mainEl.classList.add('p-5');
		}

		// On page revisit, call fetch again if last fetch is more than 30 sec ago
		if (this.$fetchState.timestamp <= Date.now() - 30000) {
			this.$fetch();
		}
	}

	onSelectPokemon(pokemon: Result) {
		this.$router.push(`/${pokemon.name}`);
	}

	onFocusSearch() {
		this.$nextTick(() => {
			this.searchPokemonEl.select();
		});
		this.searchPokemonEl.focus();
	}
}
</script>
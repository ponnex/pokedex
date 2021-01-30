<template>
	<div class="flex flex-col h-screen max-w-screen-2xl min-h-screen mx-auto p-5">
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
						<path v-if="$colorMode.preference == 'light'" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
						<path v-if="$colorMode.preference == 'dark'" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
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
				<span class="block md:pt-4 lg:pt-4 font-medium text-xs text-gray-500 dark:text-white">The Pokédex contains detailed stats for every creature from the Pokémon games.</span>
			</form>
		</header>
		<div v-if="!pokemonList" class="flex flex-grow justify-self-center self-center px-5">
			<div class="grid justify-self-center self-center">
				<img src="@/assets/images/pokeball_loading.gif" alt="pokeball_loading" class="h-32 justify-self-center self-center">
				<span class="justify-self-center self-center text-gray-500 dark:text-white">Loading...</span>
			</div>
		</div>
		<div v-else class="h-auto lg:grid-cols-3 overflow-y-auto mb-5 sm:gap-4 sm:grid sm:grid-cols-2 sm:items-center sm:space-y-0 space-y-3 xl:grid-cols-4 rounded-2xl">
			<pokemon-card
				v-for="(pokemon, pokemonIdx) in pokemonList"
				:key="pokemonIdx"
				:pokemon="pokemon"
				:details-updated="!$fetchState.pending"
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

<script lang="ts">
import { Component, Ref, mixins } from 'nuxt-property-decorator';
import { PokemonList } from '@/model/pokemon-list';
import ChangeTheme from '@/utils/change-theme';
import { ENDPOINTS } from '@/model/constants';

const defaults = require('@/environment/defaults.json');

@Component
export default class IndexPage extends mixins(ChangeTheme) {
	@Ref('search-pokemon') searchPokemonEl!: HTMLInputElement;
	paginationLimit: number = 20;
	currentPage: number = 1;
	searchKey: string = '';
	isSearching: boolean = false;

	get pokemonList() {
		return this.$accessor.pokemon.listResponse.results;
	}

	get numberOfPages() {
		return Math.ceil(this.$accessor.pokemon.count / this.paginationLimit);
	}

	fetch() {
		const { search } = this.$route.query;
		if (search && search.length >= 3) {
			this.searchKey = search as string;
			this.isSearching = true;
			this.$accessor.pokemon.searchPokemon(search as string);
		} else {
			this.$router.push('/');
			this.$accessor.pokemon.getListResponse();
		}
	}

	get nextUrl() {
		return this.$accessor.pokemon.nextUrl;
	}

	get prevUrl() {
		return this.$accessor.pokemon.prevUrl;
	}

	onSearchSubmit() {
		if (this.searchKey !== '' && this.searchKey.length >= 3) {
			this.$router.push(`/?search=${this.searchKey}`);
			this.$accessor.pokemon.searchPokemon(this.searchKey);
		}
	}

	onSearchInput() {
		const { search } = this.$route.query;
		if (this.searchKey === '' && search) {
			this.$router.push(`/?search=${this.searchKey}`);
			this.isSearching = false;
			this.$accessor.pokemon.getListResponse();
		}
	}

	backFromSearch() {
		this.searchKey = '';
		this.onSearchInput();
	}

	prevPage() {
		const params = this.prevUrl?.replace(`${defaults.baseUrl}${ENDPOINTS.POKEMON}`, '');
		this.$accessor.pokemon.getListResponse(params);
	}

	nextPage() {
		const params = this.nextUrl?.replace(`${defaults.baseUrl}${ENDPOINTS.POKEMON}`, '');
		this.$accessor.pokemon.getListResponse(params);
	}

	activated() {
		this.$accessor.pokemon.setListResponse(this.$accessor.pokemon.listResponse);
	}

	onSelectPokemon(pokemon: PokemonList) {
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

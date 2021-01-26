<template>
	<div v-if="!$fetchState.pending" class="h-screen text-white">
		<div class="h-56" :class="`bg-${getPokemonColor()}`"></div>
		<div class="details-bg" :class="`bg-${getPokemonColor()}`"></div>
		<div class="absolute flex flex-col h-full p-5 top-0 w-screen space-y-4">
			<div class="grid grid-cols-12 fill-current text-white dark:text-gray-900">
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
					<path v-if="$colorMode.preference == 'light'" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
					<path v-if="$colorMode.preference == 'dark'" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
				</svg>
			</div>
			<div class="flex flex-col leading-none">
				<div class="inline-grid grid-cols-3">
					<span class="col-span-2 font-bold text-3xl">{{ startCase(pokemon.name) }}</span>
					<span class="col-span-1 text-white dark:text-gray-900 opacity-75 font-bold justify-self-end self-center text-4xl">{{ `#${padStart(pokemon.id, 3, '0')}` }}</span>
				</div>
				<pokemon-type-badge
					:types="pokemon.types"
				/>
				<img
					:src="pokemonImage"
					:alt="pokemon.name"
					class="h-36 w-36 justify-self-center self-center"
				>
			</div>
			<div class="flex justify-around md:justify-center md:space-x-8 font-medium text-sm pt-3">
				<a
					href="#about"
					class="px-3 py-1 rounded shadow"
					:class="isActiveTab('#about')"
				>
					About
				</a>
				<a
					href="#stats"
					class="px-3 py-1 rounded shadow"
					:class="isActiveTab('#stats')"
				>
					Stats
				</a>
				<a
					href="#evolution"
					class="px-3 py-1 rounded shadow"
					:class="isActiveTab('#evolution')"
				>
					Evolution
				</a>
			</div>
			<div class="no-scrollbar text-gray-700 dark:text-white flex overflow-x-scroll overflow-y-hidden w-full">
				<section id="about" class="flex flex-col min-w-full space-y-3">
					<div class="flex flex-col items-center justify-center">
						<span class="text-sm break-all">{{ getFlavorText() }}</span>
					</div>
					<pokemon-type-badge
						:types="pokemon.types"
						:full="true"
					/>
					<span class="font-black pb-2" :class="`text-${getPokemonColor()}`">Pokédex Data</span>
					<div class="block mt-2 font-black text-xs">
						<div class="grid grid-cols-2 gap-4">
							<div class="grid grid-cols-2">
								<span class="col-span-1 text-gray-700 dark:text-white">Height</span>
								<span class="col-span-1" :class="`text-${getPokemonColor()}`">{{ pokemon.height / 10 }} m</span>
							</div>
							<div class="grid grid-cols-2">
								<span class="col-span-1 text-gray-700 dark:text-white">Weight</span>
								<span class="col-span-1" :class="`text-${getPokemonColor()}`">{{ pokemon.weight / 10 }} kg</span>
							</div>
							<div class="grid grid-cols-2">
								<span class="col-span-1 text-gray-700 dark:text-white">Gender</span>
								<span class="col-span-1" :class="`text-${getPokemonColor()}`">{{ }}</span>
							</div>
							<div class="grid grid-cols-2">
								<span class="col-span-1 text-gray-700 dark:text-white">Growth Rate</span>
								<span class="col-span-1" :class="`text-${getPokemonColor()}`">{{ getGrowthRate() }}</span>
							</div>
							<div class="grid grid-cols-2">
								<span class="col-span-1 text-gray-700 dark:text-white">Base Exp</span>
								<span class="col-span-1" :class="`text-${getPokemonColor()}`">{{ pokemon.baseExperience }}</span>
							</div>
							<div class="grid grid-cols-2">
								<span class="col-span-1 text-gray-700 dark:text-white">Rarity</span>
								<span class="col-span-1" :class="`text-${getPokemonColor()}`">{{ getRarity() }}</span>
							</div>
						</div>
					</div>
				</section>
				<section id="stats" class="min-w-full">
					Stats
				</section>
				<section id="evolution" class="min-w-full">
					Evolution
				</section>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Watch, mixins } from 'nuxt-property-decorator';
import ChangeTheme from '@/utils/change-theme';
declare const _: any;

@Component
export default class PokemonDetilsPage extends mixins(ChangeTheme) {
	startCase: Function = _.startCase;
	padStart: Function = _.padStart;
	activeTab: string = 'About';

	@Watch('$route.hash', { deep: true, immediate: true })
	onHashChange(hash: string) {
		if (hash !== '' && hash) {
			this.activeTab = hash;
			document.querySelector(`a[href='${hash}']`)?.scrollIntoView();
			document.querySelector(`${hash}`)?.scrollIntoView();
		}
	}

	get pokemon() {
		return this.$accessor.pokemon.pokemon;
	}

	get pokemonImage() {
		return this.pokemon.sprites.other.officialArtwork.frontDefault ? this.pokemon.sprites.other.officialArtwork.frontDefault : this.pokemon.sprites.other.dreamWorld.frontDefault;
	}

	async fetch() {
		const { pathMatch } = this.$route.params;
		await this.$accessor.pokemon.getPokemon(pathMatch);
		await this.$accessor.pokemon.getPokemonSpecies(pathMatch);
	}

	activated() {
		if (this.$route.hash === '') {
			window.location.hash = '#about';
		}
		const mainEl = document.querySelector('main') as HTMLElement;
		if (mainEl && mainEl.classList.contains('p-5')) {
			mainEl.classList.remove('p-5');
		}

		if (this.$fetchState.timestamp <= Date.now() - 3000) {
			this.$fetch();
		}
	}

	getPokemonColor() {
		const color = this.pokemon.pokemonSpecies ? this.pokemon.pokemonSpecies.color.name : undefined;
		if (!color) {
			return 'gray-500';
		}
		if (color === 'white') {
			return 'gray-500';
		} else if (color === 'brown') {
			return 'yellow-800';
		} else {
			return color ? `${color}-500` : '';
		}
	}

	getFlavorText() {
		return this.pokemon.pokemonSpecies ? this.pokemon.pokemonSpecies.flavorTextEntries[0].flavorText.replace(' ', ' ') : '';
	}

	getGrowthRate() {
		return this.pokemon.pokemonSpecies ? this.startCase(this.pokemon.pokemonSpecies.growthRate.name) : '';
	}

	getRarity() {
		if (!this.pokemon.pokemonSpecies) {
			return;
		}
		if (this.pokemon.pokemonSpecies.isLegendary) {
			return 'Legendary';
		} else if (this.pokemon.pokemonSpecies.isMythical) {
			return 'Mythical';
		} else {
			return 'Normal';
		}
	}

	isActiveTab(hash: string) {
		return this.activeTab === hash ? `text-${this.getPokemonColor()}` : 'text-gray-400';
	}

	onHome() {
		this.$router.push('/');
	}
}
</script>

<style lang="scss" scoped>
.details-bg {
	display: block;
	position: absolute;
	width: 100%;
	height: 50px;
	border-bottom-left-radius: 50%;
	border-bottom-right-radius: 50%;
	top: 14rem;
}
</style>

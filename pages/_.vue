<template>
	<div class="flex flex-col h-screen text-white">
		<div v-show="pokemon && !$fetchState.pending">
			<div class="h-56" :class="`bg-${pokemonColor()}`"></div>
			<div class="details-bg max-w-screen-2xl" :class="`bg-${pokemonColor()}`"></div>
			<svg
				width="104"
				height="104"
				viewBox="0 0 104 104"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="fixed h-80 w-80 lg:h-96 lg:w-96 opacity-75 pointer-events-none -left-24 2xl:left-auto -top-28 "
			>
				<path
					opacity="0.1"
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M104 52C104 80.7188 80.7188 104 52 104C23.2812 104 0 80.7188 0 52C0 23.2812 23.2812 0 52 0C80.7188 0 104 23.2812 104 52ZM69 52C69 61.3888 61.3888 69 52 69C42.6112 69 35 61.3888 35 52C35 42.6112 42.6112 35 52 35C61.3888 35 69 42.6112 69 52ZM76 52C76 65.2548 65.2548 76 52 76C38.7452 76 28 65.2548 28 52H8C8 76.3005 27.6995 96 52 96C76.3005 96 96 76.3005 96 52H76Z"
					fill="currentColor"
				/>
			</svg>
			<div class="max-w-screen-2xl absolute flex flex-col h-screen p-5 top-0 w-screen">
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
				<div class="mt-2 flex flex-col leading-none">
					<div class="inline-grid grid-cols-3">
						<span class="col-span-2 font-bold text-3xl">{{ pokemon ? startCase(pokemon.name) : '' }}</span>
						<span class="col-span-1 text-white dark:text-gray-900 opacity-75 font-bold justify-self-end self-center text-4xl">{{ pokemon ? `#${padStart(pokemon.id, 3, '0')}`: '' }}</span>
					</div>
					<pokemon-type-badge
						:types="pokemon ? pokemon.types : []"
					/>
					<img
						:src="pokemonImage"
						:alt="pokemon ? pokemon.name: ''"
						class="h-40 w-40 -m-4 justify-self-center self-center"
					>
				</div>
				<div v-if="pokemon" class="no-scrollbar text-gray-700 dark:text-white overflow-auto flex-grow flex flex-col min-w-full space-y-5 mt-12">
					<div class="flex flex-col items-center justify-center">
						<span class="break-words text-justify text-sm">{{ pokemonDescription() }}</span>
					</div>
					<pokemon-type-badge
						:types="pokemon ? pokemon.types : []"
						:full="true"
					/>
					<span class="font-black pt-2 pb-2 text-xl" :class="`text-${pokemonColor()}`">Pokédex Data</span>
					<div class="grid grid-cols-2 gap-4 mt-2 font-black text-xs">
						<div class="grid grid-cols-2">
							<span class="col-span-1 text-gray-700 dark:text-white">Height</span>
							<span class="col-span-1" :class="`text-${pokemonColor()}`">{{ pokemon.height / 10 }} m</span>
						</div>
						<div class="grid grid-cols-2">
							<span class="col-span-1 text-gray-700 dark:text-white">Weight</span>
							<span class="col-span-1" :class="`text-${pokemonColor()}`">{{ pokemon.weight / 10 }} kg</span>
						</div>
						<div class="grid grid-cols-2">
							<span class="col-span-1 text-gray-700 dark:text-white">Gender</span>
							<span class="col-span-1" :class="`text-${pokemonColor()}`">{{ pokemonGender() }}</span>
						</div>
						<div class="grid grid-cols-2">
							<span class="col-span-1 text-gray-700 dark:text-white">Growth Rate</span>
							<span class="col-span-1" :class="`text-${pokemonColor()}`">{{ pokemonGrowthRate() }}</span>
						</div>
						<div class="grid grid-cols-2">
							<span class="col-span-1 text-gray-700 dark:text-white">Base Exp</span>
							<span class="col-span-1" :class="`text-${pokemonColor()}`">{{ pokemon.baseExperience }}</span>
						</div>
						<div class="grid grid-cols-2">
							<span class="col-span-1 text-gray-700 dark:text-white">Rarity</span>
							<span class="col-span-1" :class="`text-${pokemonColor()}`">{{ pokemonRarity() }}</span>
						</div>
					</div>
					<span class="font-black pb-2 text-xl" :class="`text-${pokemonColor()}`">Base Stats</span>
					<div class="grid grid-rows-6 gap-4 my-5 text-xs">
						<div v-for="(stats, statsIdx) in pokemon.stats" :key="statsIdx" class="grid grid-cols-12">
							<span class="col-span-4 font-black text-gray-700 dark:text-white">{{ stats.stat.name !== 'hp' ? startCase(stats.stat.name) : 'HP' }}</span>
							<span class="col-span-1 text-gray-700 dark:text-white">{{ stats.baseStat }}</span>
							<pokemon-stats-bar
								:stat="stats.baseStat"
								:bar-color="pokemonColor()"
								class="col-span-7"
							/>
						</div>
					</div>
					<span class="font-black pt-2 text-xl" :class="`text-${pokemonColor()}`">Abilities</span>
					<div v-for="(ability, abilityIdx) in pokemon.abilities" :key="abilityIdx" class="grid grid-cols-3 font-black text-xs">
						<span class="leading-none col-span-1 text-gray-700 dark:text-white text-xs">{{ startCase(ability.ability.name) }}</span>
						<pokemon-ability class="col-span-2" :ability="ability.ability.url" />
					</div>
					<span class="font-black text-xl" :class="`text-${pokemonColor()}`">Strength</span>
					<pokemon-damage-relation
						v-if="pokemon"
						:types="pokemon.types"
						:damage-type="'strength'"
					/>
					<span class="font-black text-xl" :class="`text-${pokemonColor()}`">Weakness</span>
					<pokemon-damage-relation
						v-if="pokemon"
						:types="pokemon.types"
						:damage-type="'weakness'"
					/>
					<span class="font-black pb-2 text-xl" :class="`text-${pokemonColor()}`">Evolution</span>
					<div v-if="evolutionStages.length" class="flex flex-col justify-self-center self-center space-y-5">
						<div v-for="(evolutionStage, evolutionStageIdx) in evolutionStages" :key="evolutionStageIdx">
							<pokemon-evolution-stage
								:evolution-stage="evolutionStage"
								:pokemon-color="pokemonColor()"
							/>
						</div>
					</div>
					<div v-else class="grid flex-grow">
						<span class="justify-self-center self-center" :class="`text-${pokemonColor()}`">This Pokémon does not evolve.</span>
					</div>
					<span class="font-black pt-2 text-xl" :class="`text-${pokemonColor()}`">Moves</span>
					<div class="grid grid-cols-5 font-black text-xs gap-0.5">
						<span v-for="(move, moveIdx) in filterMoves(pokemon.moves)" :key="moveIdx" class="moves-name leading-none text-gray-700 dark:text-white text-sm">{{ startCase(move.move.name) }}</span>
					</div>
				</div>
			</div>
		</div>
		<div v-show="!pokemon && $fetchState.pending" class="grid flex-grow justify-self-center self-center">
			<div class="grid justify-self-center self-center">
				<img src="@/assets/images/pokeball_loading.gif" alt="pokeball_loading" class="h-32 justify-self-center self-center">
				<span class="justify-self-center self-center text-gray-500 dark:text-white">Loading...</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator';
import ChangeTheme from '@/utils/change-theme';
import { Move, Pokemon } from '@/model/pokemon';
import { FlavorTextEntry, PokemonSpecies } from '@/model/pokemon-species';
import IdFromUrl from '@/utils/id-from-url';
import { Chain } from '@/model/pokemon-evolution-chain';

declare const _: any;

@Component
export default class PokemonDetilsPage extends mixins(ChangeTheme, IdFromUrl) {
	startCase: Function = _.startCase;
	padStart: Function = _.padStart;
	evolutionStages: any[] = [];

	get pokemon(): Pokemon {
		const { pathMatch } = this.$route.params;
		const pokemon = this.$accessor.pokemon.pokemon;
		return _.find(pokemon, (pokemon: Pokemon) => {
			return pokemon.name === pathMatch.replace('/', '');
		});
	}

	get pokemonSpecies(): PokemonSpecies {
		const { pathMatch } = this.$route.params;
		const species = this.$accessor.pokemon.pokemonSpecies;
		return _.find(species, (pokemon: PokemonSpecies) => {
			return pokemon.name === pathMatch.replace('/', '');
		});
	}

	get pokemonEvolutionChain() {
		return this.$accessor.pokemon.pokemonEvolutionChain;
	}

	get pokemonImage() {
		return this.pokemon ? this.pokemon.sprites.other.officialArtwork.frontDefault : '';
	}

	async fetch() {
		const { pathMatch } = this.$route.params;
		if (!this.pokemon) {
			await this.$accessor.pokemon.getPokemon(pathMatch);
		}
		if (!this.pokemonSpecies) {
			await this.$accessor.pokemon.getPokemonSpecies(pathMatch);
		}
		if (this.pokemonSpecies) {
			const { evolutionChain } = this.pokemonSpecies;
			await this.$accessor.pokemon.getEvolutionChain(parseInt(this.idFromUrl(evolutionChain.url)));
			if (this.pokemonEvolutionChain) {
				let currentEvolveTo: Chain = this.pokemonEvolutionChain.chain;
				do {
					const evolveFrom = currentEvolveTo;
					const evolveTo = currentEvolveTo.evolvesTo ? currentEvolveTo.evolvesTo[0] : undefined;
					currentEvolveTo = evolveTo!;
					if (evolveTo) {
						this.evolutionStages.push({
							evolveFrom,
							evolveTo,
						});
					}
				} while (currentEvolveTo);
			}
		}
	}

	pokemonColor() {
		const color = this.pokemonSpecies ? this.pokemonSpecies.color.name : 'gray';
		if (color === 'white') {
			return 'gray-500';
		} else if (color === 'brown') {
			return 'yellow-800';
		} else if (color === 'black') {
			return this.$colorMode.preference === 'light' ? 'gray-800' : 'gray-500';
		} else {
			return color ? `${color}-500` : '';
		}
	}

	pokemonDescription() {
		return this.pokemonSpecies
			? _.find(this.pokemonSpecies.flavorTextEntries, (flavorTextEntry: FlavorTextEntry) => {
				return flavorTextEntry.language.name === 'en';
			}).flavorText
			: '';
	}

	pokemonGrowthRate() {
		return this.pokemonSpecies ? this.startCase(this.pokemonSpecies.growthRate.name) : 'Unknown';
	}

	pokemonRarity() {
		if (!this.pokemonSpecies) {
			return 'Unknown';
		}
		if (this.pokemonSpecies.isLegendary) {
			return 'Legendary';
		} else if (this.pokemonSpecies.isMythical) {
			return 'Mythical';
		} else {
			return 'Normal';
		}
	}

	pokemonGender() {
		if (!this.pokemonSpecies) {
			return 'Unknown';
		}
		if (this.pokemonSpecies.genderRate !== -1) {
			return 'Male / Female';
		} else {
			return 'Unknown';
		}
	}

	onHome() {
		this.$router.push('/');
	}

	filterMoves(moves: Move[]) {
		return _.filter(moves, (move: Move) => {
			return move.versionGroupDetails[0].levelLearnedAt === 0;
		});
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
.moves-name {
	font-size: 10px;
}
</style>

import { defineStore } from 'pinia';
import { find, uniqBy } from 'lodash-es';
import type { PokemonIndexEntry, PokemonIndexResponse } from '~/types/pokemon-list';
import type { Pokemon } from '~/types/pokemon';
import { ENDPOINTS, GRAPHQL_API } from '~/types/constants';
import type { PokemonSpecies } from '~/types/pokemon-species';
import type { PokemonAbility } from '~/types/pokemon-ability';
import type { PokemonType, DamageRelations } from '~/types/pokemin-type';
import type { PokemonEvolutionChain } from '~/types/pokemon-evolution-chain';

export const usePokemonStore = defineStore('pokemon', {
	state: () => ({
		pokemon: [] as Pokemon[],
		pokemonIndex: [] as PokemonIndexEntry[],
		pokemonSpecies: [] as PokemonSpecies[],
		pokemonAbility: [] as PokemonAbility[],
		pokemonType: [] as PokemonType[],
		pokemonDamangeRelation: {} as DamageRelations,
		pokemonEvolutionChain: {} as PokemonEvolutionChain,
	}),
	getters: {
		// O(1) lookups for list cards — a `find` over these arrays per card
		// re-scans on every fetch and stalls large filtered lists
		pokemonByName: (state) => {
			return new Map(state.pokemon.map(pokemon => [ pokemon.name, pokemon ]));
		},
		pokemonSpeciesByName: (state) => {
			return new Map(state.pokemonSpecies.map(species => [ species.name, species ]));
		},
	},
	actions: {
		setPokemonDamageRelations(pokemonDamangeRelation: DamageRelations) {
			this.pokemonDamangeRelation = pokemonDamangeRelation;
		},
		// One GraphQL query returns id, name, types, and species color for every
		// Pokemon — replaces the two REST calls per card the list used to need
		async getPokemonIndex() {
			if (this.pokemonIndex.length) {
				return this.pokemonIndex;
			}
			try {
				const response = await $fetch<PokemonIndexResponse>(GRAPHQL_API, {
					method: 'POST',
					body: {
						query: '{ pokemon(order_by: {id: asc}) { id name pokemontypes { type { name } } pokemonspecy { generation_id is_legendary is_mythical is_baby pokemoncolor { name } } } }',
					},
				});
				this.pokemonIndex = response.data.pokemon.map(pokemon => ({
					id: pokemon.id,
					name: pokemon.name,
					types: pokemon.pokemontypes.map(pokemonType => pokemonType.type.name),
					color: pokemon.pokemonspecy?.pokemoncolor?.name ?? '',
					generation: pokemon.pokemonspecy?.generation_id ?? 0,
					isLegendary: pokemon.pokemonspecy?.is_legendary ?? false,
					isMythical: pokemon.pokemonspecy?.is_mythical ?? false,
					isBaby: pokemon.pokemonspecy?.is_baby ?? false,
				}));
				return this.pokemonIndex;
			}
			catch {
				return;
			}
		},
		async getPokemon(pokemon: string | number) {
			let result;
			try {
				const isFetched = find(this.pokemon, (fetchedPokemon: Pokemon) => {
					const comparePokemon = typeof pokemon === 'string' ? fetchedPokemon.name : fetchedPokemon.id;
					return comparePokemon === pokemon;
				});
				if (isFetched) {
					return;
				}
				const pokeApi = usePokeApi();
				result = await pokeApi<Pokemon>(`${ENDPOINTS.POKEMON}/${pokemon}`);
				this.pokemon.push(result);
				this.pokemon = uniqBy(this.pokemon, 'name');
			}
			catch {
				return;
			}
			return result;
		},
		async getPokemonSpecies(pokemon: string | number) {
			let result;
			try {
				const pokeApi = usePokeApi();
				result = await pokeApi<PokemonSpecies>(`${ENDPOINTS.POKEMON_SPECIES}/${pokemon}`);
				this.pokemonSpecies.push(result);
				this.pokemonSpecies = uniqBy(this.pokemonSpecies, 'name');
			}
			catch {
				const species = { name: pokemon as string } as PokemonSpecies;
				this.pokemonSpecies.push(species);
				this.pokemonSpecies = uniqBy(this.pokemonSpecies, 'name');
				return;
			}
			return result;
		},
		async getPokemonAbility(ability: string | number) {
			let result;
			try {
				const pokeApi = usePokeApi();
				result = await pokeApi<PokemonAbility>(`${ENDPOINTS.POKEMON_ABILITY}/${ability}`);
				this.pokemonAbility.push(result);
				this.pokemonAbility = uniqBy(this.pokemonAbility, 'name');
			}
			catch {
				return;
			}
			return result;
		},
		async getPokemonType(type: string | number) {
			try {
				const pokeApi = usePokeApi();
				const result = await pokeApi<PokemonType>(`${ENDPOINTS.POKEMON_TYPE}/${type}`);
				this.pokemonType.push(result);
				this.pokemonType = uniqBy(this.pokemonType, 'name');
				return result;
			}
			catch {
				return undefined;
			}
		},
		async getEvolutionChain(chain: number) {
			let result;
			try {
				const pokeApi = usePokeApi();
				result = await pokeApi<PokemonEvolutionChain>(`${ENDPOINTS.EVOLUTION}/${chain}`);
				this.pokemonEvolutionChain = result;
			}
			catch {
				return;
			}
			return result;
		},
	},
});

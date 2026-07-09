import { defineStore } from 'pinia';
import { filter, find, uniqBy } from 'lodash-es';
import type { PokemonListResponse, PokemonList } from '~/types/pokemon-list';
import type { Pokemon } from '~/types/pokemon';
import { ENDPOINTS } from '~/types/constants';
import type { PokemonSpecies } from '~/types/pokemon-species';
import type { PokemonAbility } from '~/types/pokemon-ability';
import type { PokemonType, DamageRelations } from '~/types/pokemin-type';
import type { PokemonEvolutionChain } from '~/types/pokemon-evolution-chain';

export const usePokemonStore = defineStore('pokemon', {
	state: () => ({
		pokemon: [] as Pokemon[],
		pokemonList: [] as PokemonList[],
		pokemonSpecies: [] as PokemonSpecies[],
		listResponse: {} as PokemonListResponse,
		pokemonAbility: [] as PokemonAbility[],
		pokemonType: [] as PokemonType[],
		count: 1118 as number,
		pokemonDamangeRelation: {} as DamageRelations,
		pokemonEvolutionChain: {} as PokemonEvolutionChain,
		nextUrl: '' as string,
		prevUrl: '' as string,
	}),
	actions: {
		setListResponse(listResponse: PokemonListResponse) {
			this.listResponse = listResponse;
		},
		setPokemonDamageRelations(pokemonDamangeRelation: DamageRelations) {
			this.pokemonDamangeRelation = pokemonDamangeRelation;
		},
		async getListResponse(params?: string) {
			this.listResponse = {} as PokemonListResponse;
			if (!params) {
				params = '';
			}
			let result;
			try {
				const pokeApi = usePokeApi();
				result = await pokeApi<PokemonListResponse>(`${ENDPOINTS.POKEMON}${params}`);
				this.listResponse = result;
				this.count = result.count;
				this.prevUrl = result.previous;
				this.nextUrl = result.next;
			}
			catch {
				return;
			}
			return result;
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
		async searchPokemon(pokemon: string) {
			let result;
			try {
				const pokeApi = usePokeApi();
				const response = await pokeApi<PokemonListResponse>(ENDPOINTS.POKEMON, {
					params: {
						limit: this.count,
					},
				});
				const { results } = response;
				const pokemonResults = results as PokemonList[];
				const regex = new RegExp(pokemon.toString(), 'i');
				const pokemonSearch = filter(pokemonResults, (pokemonResult: PokemonList) => {
					return regex.test(pokemonResult.name);
				});
				result = { results: pokemonSearch, count: pokemonSearch.length, previous: '', next: '' } as PokemonListResponse;
				this.prevUrl = '';
				this.nextUrl = '';
				this.listResponse = result;
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

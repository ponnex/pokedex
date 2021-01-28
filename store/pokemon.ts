import { getterTree, mutationTree, actionTree } from 'nuxt-typed-vuex';
import { PokemonListResponse, PokemonList } from '@/model/pokemon-list';
import { Pokemon } from '@/model/pokemon';
import { ENDPOINTS } from '@/model/constants';
import humps from 'lodash-humps';
import { PokemonSpecies } from '@/model/pokemon-species';
import { PokemonAbility } from '@/model/pokemon-ability';
import { PokemonType, DamageRelations } from '@/model/pokemin-type';
import { PokemonEvolutionChain } from '@/model/pokemon-evolution-chain';

declare const _: any;

export const state = () => ({
	pokemon: [] as Pokemon[],
	pokemonList: [] as PokemonList[],
	pokemonSpecies: [] as PokemonSpecies[],
	listResponse: {} as PokemonListResponse,
	pokemonAbility: [] as PokemonAbility[],
	pokemonType: [] as PokemonType[],
	count: 0 as number,
	pokemonDamangeRelation: {} as DamageRelations,
	pokemonEvolutionChain: {} as PokemonEvolutionChain,
	currentPageOffset: 0 as number,
	isLoadingList: false as boolean,
});

export const getters = getterTree(state, {});

export const mutations = mutationTree(state, {
	SET_LIST_RESPONSE(state, listResponse: PokemonListResponse) {
		state.listResponse = listResponse;
	},
	SET_POKEMON_LIST(state, pokemonList: PokemonList[]) {
		state.pokemonList = _.uniqBy(_.concat(state.pokemonList, pokemonList), 'name');
	},
	SET_POKEMON(state, pokemon: Pokemon) {
		state.pokemon.push(pokemon);
		state.pokemon = _.uniqBy(state.pokemon, 'name');
	},
	SET_POKEMON_SPECIES(state, pokemonSpecies: PokemonSpecies) {
		state.pokemonSpecies.push(pokemonSpecies);
		state.pokemonSpecies = _.uniqBy(state.pokemonSpecies, 'name');
	},
	SET_POKEMON_ABILITY(state, pokemonAbility: PokemonAbility) {
		state.pokemonAbility.push(pokemonAbility);
		state.pokemonAbility = _.uniqBy(state.pokemonAbility, 'name');
	},
	SET_POKEMON_TYPE(state, pokemonType: PokemonType) {
		state.pokemonType.push(pokemonType);
		state.pokemonType = _.uniqBy(state.pokemonType, 'name');
	},
	SET_COUNT(state, count: number) {
		state.count = count;
	},
	SET_POKEMON_DAMAGE_RELATION(state, pokemonDamangeRelation: DamageRelations) {
		state.pokemonDamangeRelation = pokemonDamangeRelation;
	},
	SET_POKEMON_EVOLUTION_CHAIN(state, pokemonEvolutionChain: PokemonEvolutionChain) {
		state.pokemonEvolutionChain = pokemonEvolutionChain;
	},
	SET_CURRENT_PAGE_OFFSET(state, currentPageOffset: number) {
		state.currentPageOffset = currentPageOffset;
	},
	SET_IS_LOADING_LIST(state, isLoadingList: boolean) {
		state.isLoadingList = isLoadingList;
	},
});

export const actions = actionTree({ state, getters, mutations }, {
	setListResponse({ commit }, listResponse: PokemonListResponse) {
		commit('SET_LIST_RESPONSE', listResponse);
	},
	setPokemonDamageRelations({ commit }, pokemonDamangeRelation: DamageRelations) {
		commit('SET_POKEMON_DAMAGE_RELATION', pokemonDamangeRelation);
	},
	setIsLoadingList({ commit }, isLoading: boolean) {
		commit('SET_IS_LOADING_LIST', isLoading);
	},
	async nextPage({ state, dispatch }) {
		try {
			const offset = (state.currentPageOffset + 20 < state.count) ? state.currentPageOffset + 20 : Math.ceil(state.count / 20);
			if (offset >= state.count) {
				return;
			}
			await dispatch('getListResponse', { offset });
		} catch (err) {
			throw new Error(err);
		}
	},
	async prevPage({ state, dispatch }) {
		try {
			const offset = (state.currentPageOffset > 20) ? state.currentPageOffset - 20 : 0;
			if (!offset) {
				return;
			}
			await dispatch('getListResponse', { offset });
		} catch (err) {
			throw new Error(err);
		}
	},
	async getListResponse({ commit }, { offset }: any) {
		let result;
		try {
			commit('SET_IS_LOADING_LIST', true);
			const response = await this.$axios({
				method: 'get',
				url: `${ENDPOINTS.POKEMON}?offset=${offset}&limit=20`,
			});
			result = humps(response.data) as PokemonListResponse;
			let newPageOffset;
			if (result.previous) {
				const url = new URL(result.previous);
				newPageOffset = parseInt(url.searchParams.get('offset') as string) + 20;
			} else {
				newPageOffset = 0;
			}
			commit('SET_CURRENT_PAGE_OFFSET', newPageOffset);
			commit('SET_LIST_RESPONSE', result);
			commit('SET_COUNT', result.count);
			commit('SET_IS_LOADING_LIST', false);
		} catch (err) {
			return;
		}
		return result;
	},
	async getPokemon({ state, commit }, pokemon: string | number) {
		let result;
		try {
			const isFetched = _.find(state.pokemon, (fetchedPokemon: Pokemon) => {
				const comparePokemon = typeof pokemon === 'string' ? fetchedPokemon.name : fetchedPokemon.id;
				return comparePokemon === pokemon;
			});
			if (isFetched) {
				return;
			}
			const response = await this.$axios({
				method: 'get',
				url: `${ENDPOINTS.POKEMON}/${pokemon}`,
			});
			result = humps(response.data) as Pokemon;
			commit('SET_POKEMON', result);
		} catch (err) {
			return;
		}
		return result;
	},
	async searchPokemon({ state, commit }, pokemon: string) {
		let result;
		try {
			const response = await this.$axios({
				method: 'get',
				params: {
					limit: state.count,
				},
				url: `${ENDPOINTS.POKEMON}`,
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { results, count, ...list } = humps(response.data) as PokemonListResponse;
			const pokemonResults = results as PokemonList[];
			const regex = new RegExp(pokemon.toString(), 'i');
			const pokemonSearch = _.filter(pokemonResults, (pokemonResult: PokemonList) => {
				return regex.test(pokemonResult.name);
			});
			result = { results: pokemonSearch, count: pokemonSearch.length, ...list };
			commit('SET_LIST_RESPONSE', result);
		} catch (err) {
			return;
		}
		return result;
	},
	async getPokemonSpecies({ commit }, pokemon: string | number) {
		let result;
		try {
			const response = await this.$axios({
				method: 'get',
				url: `${ENDPOINTS.POKEMON_SPECIES}/${pokemon}`,
			});
			if (response.status === 404) {
				return;
			}
			result = humps(response.data) as PokemonSpecies;
			commit('SET_POKEMON_SPECIES', result);
		} catch (err) {
			return;
		}
		return result;
	},
	async getPokemonAbility({ commit }, ability: string | number) {
		let result;
		try {
			const response = await this.$axios({
				method: 'get',
				url: `${ENDPOINTS.POKEMON_ABILITY}/${ability}`,
			});
			if (response.status === 404) {
				return;
			}
			result = humps(response.data) as PokemonAbility;
			commit('SET_POKEMON_ABILITY', result);
		} catch (err) {
			return;
		}
		return result;
	},
	async getPokemonType({ commit }, type: string | number) {
		try {
			const response = await this.$axios({
				method: 'get',
				url: `${ENDPOINTS.POKEMON_TYPE}/${type}`,
			});
			if (response.status === 404) {
				return;
			}
			const result = humps(response.data) as PokemonType;
			commit('SET_POKEMON_TYPE', result);
			return result;
		} catch (err) {
			return undefined;
		}
	},
	async getEvolutionChain({ commit }, chain: number) {
		let result;
		try {
			const response = await this.$axios({
				method: 'get',
				url: `${ENDPOINTS.EVOLUTION}/${chain}`,
			});
			if (response.status === 404) {
				return;
			}
			result = humps(response.data) as PokemonEvolutionChain;
			commit('SET_POKEMON_EVOLUTION_CHAIN', result);
		} catch (err) {
			return;
		}
		return result;
	},
});

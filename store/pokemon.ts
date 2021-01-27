import { getterTree, mutationTree, actionTree } from 'nuxt-typed-vuex';
import { PokemonListResponse, PokemonList } from '@/model/pokemon-list';
import { Pokemon } from '@/model/pokemon';
import { ENDPOINTS } from '@/model/constants';
import humps from 'lodash-humps';
import { PokemonSpecies } from '@/model/pokemon-species';
import { PokemonAbility } from '@/model/pokemon-ability';
import { PokemonType, DamageRelations } from '@/model/pokemin-type';

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
	SET_POKEMON_TYPE(state, pokemonType) {
		state.pokemonType.push(pokemonType);
		state.pokemonType = _.uniqBy(state.pokemonType, 'name');
	},
	SET_COUNT(state, count: number) {
		state.count = count;
	},
	SET_POKEMON_DAMAGE_RELATION(state, pokemonDamangeRelation: DamageRelations) {
		state.pokemonDamangeRelation = pokemonDamangeRelation;
	},
});

export const actions = actionTree({ state, getters, mutations }, {
	setListResponse({ commit }) {
		commit('SET_LIST_RESPONSE', {} as PokemonListResponse);
	},
	setPokemonDamageRelations({ commit }, pokemonDamangeRelation: DamageRelations) {
		commit('SET_POKEMON_DAMAGE_RELATION', pokemonDamangeRelation);
	},
	async getListResponse({ commit }) {
		try {
			const response = await this.$axios({
				method: 'get',
				url: `${ENDPOINTS.POKEMON}`,
			});
			const result = humps(response.data) as PokemonListResponse;
			commit('SET_LIST_RESPONSE', result);
			commit('SET_COUNT', result.count);
			return;
		} catch (err) {
			return undefined;
		}
	},
	async getPokemon({ commit }, pokemon: string | number) {
		try {
			const response = await this.$axios({
				method: 'get',
				url: `${ENDPOINTS.POKEMON}/${pokemon}`,
			});
			const result = humps(response.data) as Pokemon;
			commit('SET_POKEMON', result);
			return result;
		} catch (err) {
			return undefined;
		}
	},
	async searchPokemon({ state, commit }, pokemon: string) {
		// @TODO: use lodash chuck for Result[] and pagination on search
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
			const listResponse = { results: pokemonSearch, count: pokemonSearch.length, ...list };
			commit('SET_LIST_RESPONSE', listResponse);
		} catch (err) {
			return undefined;
		}
	},
	async getPokemonSpecies({ commit }, pokemon: string | number) {
		try {
			const response = await this.$axios({
				method: 'get',
				url: `${ENDPOINTS.POKEMON_SPECIES}/${pokemon}`,
			});
			if (response.status === 404) {
				return;
			}
			const result = humps(response.data) as PokemonSpecies;
			commit('SET_POKEMON_SPECIES', result);
			return result;
		} catch (err) {
			return undefined;
		}
	},
	async getPokemonAbility({ commit }, ability: string | number) {
		try {
			const response = await this.$axios({
				method: 'get',
				url: `${ENDPOINTS.POKEMON_ABILITY}/${ability}`,
			});
			if (response.status === 404) {
				return;
			}
			const result = humps(response.data) as PokemonAbility;
			commit('SET_POKEMON_ABILITY', result);
			return result;
		} catch (err) {
			return undefined;
		}
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
});

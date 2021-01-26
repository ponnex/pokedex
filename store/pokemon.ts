import { getterTree, mutationTree, actionTree } from 'nuxt-typed-vuex';
import { PokemonList, Result } from '@/model/pokemon-list';
import { Pokemon } from '@/model/pokemon';
import { ENDPOINTS } from '@/model/constants';
import humps from 'lodash-humps';
import { PokemonSpecies } from '@/model/pokemon-species';

declare const _: any;

export const state = () => ({
	pokemon: {} as Pokemon,
	listing: {} as PokemonList,
	count: 0 as number,
});

export const getters = getterTree(state, {});

export const mutations = mutationTree(state, {
	SET_LISTING(state, listing: PokemonList) {
		state.listing = listing;
	},
	GET_POKEMON(state, pokemon: Pokemon) {
		state.pokemon = pokemon;
	},
	SET_COUNT(state, count: number) {
		state.count = count;
	},
});

export const actions = actionTree({ state, getters, mutations }, {
	setListing({ commit }, listing: PokemonList) {
		commit('SET_LISTING', listing);
	},
	async getListing({ state, commit }) {
		try {
			const response = await this.$axios({
				method: 'get',
				url: `${ENDPOINTS.POKEMON}`,
			});
			const result = humps(response.data) as PokemonList;
			commit('SET_LISTING', result);
			commit('SET_COUNT', result.count);
			return;
		} catch (err) {
			commit('SET_LISTING', state.listing);
			commit('SET_COUNT', state.count);
		}
	},
	async getPokemon({ state, commit }, pokemon: string | number) {
		try {
			const response = await this.$axios({
				method: 'get',
				url: `${ENDPOINTS.POKEMON}/${pokemon}`,
			});
			const result = humps(response.data) as Pokemon;
			commit('GET_POKEMON', result);
			return result;
		} catch (err) {
			commit('GET_POKEMON', state.pokemon);
		}
	},
	async getPokemonImagesForListing({ state, commit, dispatch }, listing?: PokemonList) {
		try {
			const { results, ...list } = _.cloneDeep(listing || state.listing) as PokemonList;
			for (const pokemonResult of results) {
				const response = await this.$axios({
					method: 'get',
					url: `${ENDPOINTS.POKEMON}/${pokemonResult.name}`,
				});
				const pokemon = humps(response.data) as Pokemon;
				const currPokemon: Result = _.find(results, (pokemonResult: Result) => {
					return pokemon.name === pokemonResult.name;
				});
				const pokemonSpecies = await dispatch('getPokemonSpecies', pokemon.name) as PokemonSpecies;
				currPokemon.image = pokemon.sprites.other.officialArtwork.frontDefault ? pokemon.sprites.other.officialArtwork.frontDefault : pokemon.sprites.other.dreamWorld.frontDefault;
				currPokemon.id = pokemon.id;
				currPokemon.types = pokemon.types;
				if (pokemonSpecies) {
					currPokemon.color = pokemonSpecies.color.name;
				}
			}
			commit('SET_LISTING', { results, ...list });
			return;
		} catch (err) {
			commit('SET_LISTING', state.listing);
		}
	},
	async searchPokemon({ state, commit, dispatch }, pokemon: string) {
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
			const { results, count, ...list } = humps(response.data) as PokemonList;
			const pokemonResults = results as Result[];
			const regex = new RegExp(pokemon.toString(), 'i');
			const pokemonSearch = _.filter(pokemonResults, (pokemonResult: Result) => {
				return regex.test(pokemonResult.name);
			});
			const newListing = { results: pokemonSearch, count: pokemonSearch.length, ...list };
			commit('SET_LISTING', newListing);
			await dispatch('getPokemonImagesForListing', newListing);
		} catch (err) {
			throw new Error(err);
		}
	},
	async getPokemonSpecies({ state, commit }, pokemon: string | number) {
		try {
			const response = await this.$axios({
				method: 'get',
				url: `${ENDPOINTS.POKEMON_SPECIES}/${pokemon}`,
			});
			if (response.status === 404) {
				return;
			}
			const pokemonSpecies = humps(response.data) as PokemonSpecies;
			const statePokemon = _.cloneDeep(state.pokemon) as Pokemon;
			statePokemon.pokemonSpecies = pokemonSpecies;
			commit('GET_POKEMON', statePokemon);
			return pokemonSpecies;
		} catch (err) {
			commit('GET_POKEMON', state.pokemon);
		}
	},
});

import { getterTree, mutationTree, actionTree } from 'nuxt-typed-vuex';

export const state = () => ({});

export const getters = getterTree(state, {});

export const mutations = mutationTree(state, {});

export const actions = actionTree({ state, getters, mutations }, {});

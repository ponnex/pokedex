<template>
	<div v-if="!$fetchState.pending">
		{{ startCase(pokemon.name) }}
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

declare const _: any;

@Component
export default class PokemonDetilsPage extends Vue {
	startCase: Function = _.startCase;

	get pokemon() {
		return this.$accessor.pokemon.pokemon;
	}

	async fetch() {
		const { pathMatch } = this.$route.params;
		await this.$accessor.pokemon.getPokemon(pathMatch);
	}

	activated() {
		if (this.$fetchState.timestamp <= Date.now() - 3000) {
			this.$fetch();
		}
	}
}
</script>

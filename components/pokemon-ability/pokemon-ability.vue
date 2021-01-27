<template>
	<span v-if="abilityEffect" class="col-span-2 pl-2 break-words font-normal">{{ abilityEffect.effect }}</span>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator';
import { EffectEntry2, PokemonAbility } from '@/model/pokemon-ability';
import IdFromUrl from '@/utils/id-from-url';
declare const _: any;

@Component
export default class PokemonAbilityComponent extends mixins(IdFromUrl) {
	@Prop({
		type: String,
		default: '',
	}) ability!: string;

	get abilityId() {
		return this.idFromUrl(this.ability);
	}

	get abilityEffect() {
		const ability: PokemonAbility = _.find(this.$accessor.pokemon.pokemonAbility, (ability: PokemonAbility) => {
			return ability.id === parseInt(this.abilityId);
		});
		if (!ability) {
			return;
		}
		return _.find(ability.effectEntries, (effect: EffectEntry2) => {
			return effect.language.name === 'en';
		});
	}

	async fetch() {
		await this.$accessor.pokemon.getPokemonAbility(this.abilityId) as PokemonAbility;
	}
}
</script>

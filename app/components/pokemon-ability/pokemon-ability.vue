<template>
	<span v-if="abilityEffect" class="col-span-2 pl-2 break-words font-normal">{{ abilityEffect.effect }}</span>
</template>

<script setup lang="ts">
import { find } from 'lodash-es';
import type { EffectEntry2, PokemonAbility } from '~/types/pokemon-ability';

const props = defineProps({
	ability: {
		type: String,
		default: '',
	},
});

const pokemonStore = usePokemonStore();

const abilityId = computed(() => {
	return idFromUrl(props.ability);
});

const abilityEffect = computed(() => {
	const ability: PokemonAbility | undefined = find(pokemonStore.pokemonAbility, (ability: PokemonAbility) => {
		return ability.id === parseInt(abilityId.value);
	});
	if (!ability) {
		return;
	}
	return find(ability.effectEntries, (effect: EffectEntry2) => {
		return effect.language.name === 'en';
	});
});

// Fetch on setup (replaces the Nuxt 2 non-blocking `fetch()` hook)
pokemonStore.getPokemonAbility(abilityId.value);
</script>

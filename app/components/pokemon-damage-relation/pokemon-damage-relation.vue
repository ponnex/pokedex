<template>
	<div class="mt-5">
		<div v-if="damageType === 'strength'" class="flex flex-wrap gap-8">
			<div
				v-for="(strength, strengthIdx) in pokemonDamageRelations.strength"
				:key="strengthIdx"
				class="flex flex-col w-16"
			>
				<img
					class="p-2 gap-x-1 rounded-full h-10 self-center"
					:src="typeIconUrl(strength.name)"
					:class="`${strength.name}`"
				/>
				<span class="self-center">{{ strength.damage === 'double' ? '2' : '1/2' }}</span>
			</div>
		</div>
		<div v-else class="flex flex-wrap gap-8">
			<div
				v-for="(weakness, weaknessIdx) in pokemonDamageRelations.weakness"
				:key="weaknessIdx"
				class="flex flex-col w-16"
			>
				<img
					class="p-2 gap-x-1 rounded-full h-10 self-center"
					:src="typeIconUrl(weakness.name)"
					:class="`${weakness.name}`"
				/>
				<span class="self-center">{{ weakness.damage === 'double' ? '2' : '1/2' }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { cloneDeep, concat, includes, map, filter, reduce, uniqBy } from 'lodash-es';
import type { PropType } from 'vue';
import type { Type } from '~/types/pokemon';
import type { PokemonType, DamageRelations } from '~/types/pokemin-type';

const props = defineProps({
	types: {
		type: Array as PropType<Type[]>,
		default: () => { return []; },
	},
	damageType: {
		type: String,
		default: 'strength',
	},
});

const pokemonStore = usePokemonStore();

const pokemonDamageRelations = computed(() => {
	if (!Object.keys(pokemonStore.pokemonDamangeRelation).length) {
		return {
			strength: [],
			weakness: [],
		};
	}
	const strengthDouble = pokemonStore.pokemonDamangeRelation.doubleDamageTo.map((damage) => {
		return {
			...damage,
			damage: 'double',
		};
	});
	const strengthHalf = pokemonStore.pokemonDamangeRelation.halfDamageTo.map((damage) => {
		return {
			...damage,
			damage: 'half',
		};
	});
	const weaknessDouble = pokemonStore.pokemonDamangeRelation.doubleDamageFrom.map((damage) => {
		return {
			...damage,
			damage: 'double',
		};
	});
	const weaknessHalf = pokemonStore.pokemonDamangeRelation.halfDamageFrom.map((damage) => {
		return {
			...damage,
			damage: 'half',
		};
	});

	const strength = concat(strengthDouble, strengthHalf);
	const weakness = concat(weaknessDouble, weaknessHalf);
	return { strength, weakness };
});

// Fetch on setup (replaces the Nuxt 2 non-blocking `fetch()` hook)
const fetchDamageRelations = async() => {
	for (const type of props.types) {
		const typeId = idFromUrl(type.type.url);
		await pokemonStore.getPokemonType(typeId);
	}

	// Same lodash filter → map → reduce pipeline as the Nuxt 2 `_.chain()` version
	// (lodash-es named imports do not support `chain`)
	const matchingTypes = filter(cloneDeep(pokemonStore.pokemonType), (pokemonType: PokemonType) => {
		const typeNames = map(props.types, (type: Type) => {
			return type.type.name;
		});
		return includes(typeNames, pokemonType.name);
	});
	const typeDamageRelations = map(matchingTypes, (pokemonType: PokemonType) => {
		return pokemonType.damageRelations;
	});
	const damageRelations: DamageRelations = reduce(typeDamageRelations, (accum: DamageRelations, damageRelations: DamageRelations) => {
		const { doubleDamageFrom, doubleDamageTo, halfDamageFrom, halfDamageTo } = accum as DamageRelations;

		return {
			doubleDamageFrom: uniqBy(concat(doubleDamageFrom, damageRelations.doubleDamageFrom), 'name'),
			doubleDamageTo: uniqBy(concat(doubleDamageTo, damageRelations.doubleDamageTo), 'name'),
			halfDamageFrom: uniqBy(concat(halfDamageFrom, damageRelations.halfDamageFrom), 'name'),
			halfDamageTo: uniqBy(concat(halfDamageTo, damageRelations.halfDamageTo), 'name'),
		} as DamageRelations;
	}) as DamageRelations;
	pokemonStore.setPokemonDamageRelations(damageRelations);
};

fetchDamageRelations();
</script>

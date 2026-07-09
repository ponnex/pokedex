<template>
	<div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 py-1">
		<button
			v-for="type in modelValue.types"
			:key="`type-${type}`"
			type="button"
			:class="type"
			:aria-label="`Remove ${capitalize(type)} filter`"
			class="flex items-center shrink-0 gap-x-1 px-3 py-1.5 rounded-xl cursor-pointer shadow-sm transition-opacity duration-200 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
			@click="removeType(type)"
		>
			<img
				class="h-3 self-center"
				:src="typeIconUrl(type)"
				:alt="`${capitalize(type)} type icon`"
			/>
			<span class="pill-label font-bold text-white">{{ upperCase(type) }}</span>
			<svg class="text-white" width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
			</svg>
		</button>
		<button
			v-for="generation in modelValue.generations"
			:key="`gen-${generation}`"
			type="button"
			:aria-label="`Remove Gen ${generation} filter`"
			class="flex items-center shrink-0 gap-x-1.5 px-3 py-1.5 rounded-xl cursor-pointer bg-red-600 shadow-sm transition-opacity duration-200 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
			@click="removeGeneration(generation)"
		>
			<span class="pill-label font-bold text-white">GEN {{ ROMAN[generation - 1] }}</span>
			<svg class="text-white" width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
			</svg>
		</button>
		<button
			v-for="category in modelValue.categories"
			:key="`cat-${category}`"
			type="button"
			:aria-label="`Remove ${capitalize(category)} filter`"
			class="flex items-center shrink-0 gap-x-1.5 px-3 py-1.5 rounded-xl cursor-pointer bg-gray-700 dark:bg-gray-600 shadow-sm transition-opacity duration-200 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
			@click="removeCategory(category)"
		>
			<span class="pill-label font-bold text-white">{{ upperCase(category) }}</span>
			<svg class="text-white" width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
			</svg>
		</button>
		<button
			type="button"
			class="shrink-0 px-2 py-1 rounded-xl cursor-pointer text-xs font-medium text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
			@click="emit('update:modelValue', { types: [], generations: [], categories: [] })"
		>
			Clear all
		</button>
	</div>
</template>

<script setup lang="ts">
import { upperCase, capitalize } from 'lodash-es';
import type { PropType } from 'vue';
import type { PokemonFilters, PokemonCategory } from '~/types/pokemon-list';

const ROMAN = [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX' ];

const props = defineProps({
	modelValue: {
		type: Object as PropType<PokemonFilters>,
		default: () => { return { types: [], generations: [], categories: [] } as PokemonFilters; },
	},
});

const emit = defineEmits<{ 'update:modelValue': [filters: PokemonFilters] }>();

const hasActiveFilters = computed(() => {
	return props.modelValue.types.length > 0
		|| props.modelValue.generations.length > 0
		|| props.modelValue.categories.length > 0;
});

const removeType = (type: string) => {
	emit('update:modelValue', {
		...props.modelValue,
		types: props.modelValue.types.filter((active) => { return active !== type; }),
	});
};

const removeGeneration = (generation: number) => {
	emit('update:modelValue', {
		...props.modelValue,
		generations: props.modelValue.generations.filter((active) => { return active !== generation; }),
	});
};

const removeCategory = (category: PokemonCategory) => {
	emit('update:modelValue', {
		...props.modelValue,
		categories: props.modelValue.categories.filter((active) => { return active !== category; }),
	});
};
</script>

<style lang="scss" scoped>
.pill-label {
	font-size: 8px;
}
</style>

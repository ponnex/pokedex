<template>
	<div class="flex items-center gap-x-2">
		<div class="flex gap-x-2 overflow-x-auto no-scrollbar py-1" role="group" aria-label="Filter by type">
			<button
				v-for="type in POKEMON_TYPES"
				:key="type"
				type="button"
				:aria-pressed="isActive(type)"
				:title="`${capitalize(type)}`"
				class="flex items-center shrink-0 gap-x-1 px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
				:class="isActive(type) ? [type, 'shadow-md'] : 'bg-gray-500 dark:bg-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600'"
				@click="toggleType(type)"
			>
				<img
					class="h-3 self-center"
					:src="typeIconUrl(type)"
					:alt="`${capitalize(type)} type icon`"
				/>
				<span class="type-name font-bold text-white">{{ upperCase(type) }}</span>
			</button>
		</div>
		<button
			v-if="modelValue.length"
			type="button"
			aria-label="Clear type filters"
			class="flex items-center shrink-0 gap-x-1 px-2 py-1 rounded-xl cursor-pointer text-xs font-medium text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
			@click="clearTypes()"
		>
			<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			</svg>
			Clear
		</button>
	</div>
</template>

<script setup lang="ts">
import { upperCase, capitalize } from 'lodash-es';
import type { PropType } from 'vue';

const POKEMON_TYPES = [
	'normal', 'fire', 'water', 'grass', 'electric', 'ice',
	'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
	'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

const props = defineProps({
	modelValue: {
		type: Array as PropType<string[]>,
		default: () => { return []; },
	},
});

const emit = defineEmits<{ 'update:modelValue': [types: string[]] }>();

const isActive = (type: string) => {
	return props.modelValue.includes(type);
};

const toggleType = (type: string) => {
	const types = isActive(type)
		? props.modelValue.filter((activeType) => { return activeType !== type; })
		: [ ...props.modelValue, type ];
	emit('update:modelValue', types);
};

const clearTypes = () => {
	emit('update:modelValue', []);
};
</script>

<style lang="scss" scoped>
.type-name {
	font-size: 8px;
}
</style>

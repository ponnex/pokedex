<template>
	<div class="flex items-center gap-x-2">
		<div class="flex flex-wrap gap-2 py-1" role="group" aria-label="Filter by type">
			<button
				v-for="type in POKEMON_TYPES"
				:key="type"
				type="button"
				:aria-pressed="isActive(type)"
				:title="`${capitalize(type)}`"
				class="flex items-center shrink-0 gap-x-1 px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
				:class="[type, 'type-chip', { 'type-chip--active shadow-md': isActive(type) }]"
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
</script>

<style lang="scss" scoped>
.type-name {
	font-size: 8px;
}

/*
	Idle chips are a subtle neutral; the type color (from the global type
	classes) shows through on hover and while active
*/
.type-chip:not(.type-chip--active):not(:hover) {
	background: rgba(148, 163, 184, 0.22);

	img {
		filter: brightness(0) invert(0.55);
	}

	.type-name {
		color: rgb(120, 130, 145);
	}
}
</style>

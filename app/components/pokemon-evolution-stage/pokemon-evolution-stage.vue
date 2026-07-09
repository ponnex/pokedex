<template>
	<div class="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar w-full">
		<template v-for="(node, nodeIdx) in path" :key="node.id">
			<NuxtLink
				:to="`/${node.name}`"
				class="flex flex-col items-center shrink-0 cursor-pointer"
			>
				<img
					:src="officialArtworkUrl(node.id)"
					:alt="node.name"
					class="h-20 w-20 md:h-28 md:w-28"
				>
				<span class="text-[11px] font-bold capitalize text-gray-500 dark:text-gray-400">{{ node.name }}</span>
			</NuxtLink>
			<div v-if="nodeIdx < path.length - 1" class="flex flex-col items-center justify-center gap-y-2 shrink-0 w-14 md:w-24 mx-2">
				<span class="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-bold whitespace-nowrap" :class="`text-${pokemonColor}`">{{ node.minLevelToNext ? `Lv. ${node.minLevelToNext}` : 'Evolves' }}</span>
				<div class="bg-gray-200 dark:bg-gray-700 h-1 rounded-sm w-full"></div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { EvolutionPathNode } from '~/types/pokemon-details';

// Purely presentational — renders one flattened root→leaf evolution path as a
// single horizontal chain; species ids from the details GraphQL query build
// the artwork URLs directly, so no per-stage REST fetch is needed
defineProps({
	path: {
		type: Array as PropType<EvolutionPathNode[]>,
		default: () => [],
	},
	pokemonColor: {
		type: String,
		default: '',
	},
});
</script>

<template>
	<div class="grid grid-cols-8">
		<NuxtLink
			:to="`/${evolutionStage.evolveFrom.name}`"
			class="col-span-3 h-28 justify-self-start self-center w-28 cursor-pointer"
		>
			<img
				:src="officialArtworkUrl(evolutionStage.evolveFrom.id)"
				:alt="evolutionStage.evolveFrom.name"
			>
		</NuxtLink>
		<div class="flex flex-col col-span-2 items-center justify-center gap-y-2">
			<span class="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-bold" :class="`text-${pokemonColor}`">{{ evolutionStage.minLevel ? `Lv. ${evolutionStage.minLevel}` : 'Evolves' }}</span>
			<div class="bg-gray-200 dark:bg-gray-700 h-1 rounded-sm w-full"></div>
		</div>
		<NuxtLink
			:to="`/${evolutionStage.evolveTo.name}`"
			class="col-span-3 h-28 justify-self-start self-center w-28 cursor-pointer"
		>
			<img
				:src="officialArtworkUrl(evolutionStage.evolveTo.id)"
				:alt="evolutionStage.evolveTo.name"
			>
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { EvolutionStage } from '~/types/pokemon-details';

// Purely presentational — species ids from the details GraphQL query build
// the artwork URLs directly, so no per-stage REST fetch is needed
defineProps({
	evolutionStage: {
		type: Object as PropType<EvolutionStage>,
		default: () => { return {} as EvolutionStage; },
	},
	pokemonColor: {
		type: String,
		default: '',
	},
});
</script>

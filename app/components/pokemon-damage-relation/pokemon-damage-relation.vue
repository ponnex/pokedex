<template>
	<div class="mt-3">
		<div class="flex flex-wrap gap-x-4 gap-y-3">
			<div
				v-for="(relation, relationIdx) in relations"
				:key="relationIdx"
				class="flex flex-col w-12"
				:title="startCase(relation.name)"
			>
				<img
					class="p-2 rounded-full h-10 w-10 self-center"
					:src="typeIconUrl(relation.name)"
					:alt="relation.name"
					:class="`${relation.name}`"
				/>
				<span class="self-center mt-1 text-[11px] font-bold tabular-nums text-gray-500 dark:text-gray-400">{{ relation.damage === 'double' ? '×2' : '×½' }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { startCase } from 'lodash-es';
import type { PropType } from 'vue';
import type { DamageRelationEntry } from '~/types/pokemon-details';

// Purely presentational — damage relations now come precomputed from the
// details GraphQL query instead of per-type REST calls
defineProps({
	relations: {
		type: Array as PropType<DamageRelationEntry[]>,
		default: () => { return []; },
	},
});
</script>

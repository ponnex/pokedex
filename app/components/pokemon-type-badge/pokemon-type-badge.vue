<template>
	<div v-if="types" class="flex space-x-2 mt-2">
		<div
			v-for="(type, typeIdx) in types"
			v-show="isBadgeImageLoaded"
			:key="typeIdx"
			class="flex p-1 gap-x-1"
			:class="[`${type.type.name}`, {'rounded': full}, {'rounded-xl': !full}]"
		>
			<img
				class="h-3 self-center"
				:src="typeIconUrl(type.type.name)"
				:title="`${capitalize(type.type.name)}`"
				:alt="`${capitalize(type.type.name)}`"
				@load="onImageLoad()"
			/>
			<span v-if="full" class="type-name font-bold text-white">{{ upperCase(type.type.name) }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { upperCase, capitalize } from 'lodash-es';
import type { PropType } from 'vue';
import type { Type } from '~/types/pokemon';

defineProps({
	types: {
		type: Array as PropType<Type[]>,
		default: () => { return []; },
	},
	full: {
		type: Boolean,
		default: false,
	},
});

const isBadgeImageLoaded = ref(false);

const onImageLoad = () => {
	isBadgeImageLoaded.value = true;
};
</script>

<style lang="scss" scoped>
.type-name {
	font-size: 8px;
}
</style>

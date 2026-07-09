<template>
	<div
		class="relative inline-grid grid-cols-3 gap-x-4 rounded-2xl min-w-full h-24 text-white dark:text-black shadow cursor-pointer"
		:class="getBgColor()"
		@click="(event) => emit('click', event)"
	>
		<div class="justify-self-center self-center col-span-1">
			<img
				v-if="!isImageBroken"
				ref="pokemon-image"
				class="h-24 p-2 object-contain transition-opacity duration-200"
				:class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
				:src="officialArtworkUrl(pokemon.id)"
				:alt="pokemon.name"
				loading="lazy"
				decoding="async"
				@load="onImageLoad()"
				@error="isImageBroken = true"
			/>
		</div>
		<div class="flex flex-col col-span-2">
			<span
				class="text-2xl font-medium pt-2 overflow-hidden text-ellipsis whitespace-nowrap"
			>{{ startCase(pokemon.name) }}</span>
			<pokemon-type-badge :types="pokemonTypes" :text-only="true" />
		</div>
		<span
			class="absolute bottom-0 dark:text-gray-900 font-semibold leading-9 opacity-50 right-0 text-5xl text-white"
		>{{ `#${padStart(String(pokemon.id), 3, "0")}` }}</span>
	</div>
</template>

<script setup lang="ts">
import { padStart, startCase } from 'lodash-es';
import type { PropType } from 'vue';
import type { PokemonIndexEntry } from '~/types/pokemon-list';
import type { Type } from '~/types/pokemon';

const props = defineProps({
	pokemon: {
		type: Object as PropType<PokemonIndexEntry>,
		default: () => {
			return {} as PokemonIndexEntry;
		},
	},
});

const emit = defineEmits([ 'click' ]);

const colorMode = useColorMode();

const isImageLoaded = ref(false);
const isImageBroken = ref(false);

const pokemonTypes = computed<Type[]>(() => {
	return props.pokemon.types.map((name, slot) => {
		return { slot: slot + 1, type: { name, url: '' } } as Type;
	});
});

const getBgColor = () => {
	const color = props.pokemon.color || 'gray';
	if (color === 'white') {
		return 'bg-gray-500';
	}
	else if (color === 'brown') {
		return 'bg-yellow-800';
	}
	else if (color === 'black') {
		return colorMode.preference === 'light' ? 'bg-gray-800' : 'bg-gray-700';
	}
	else {
		return `bg-${color}-500`;
	}
};

const onImageLoad = () => {
	isImageLoaded.value = true;
};
</script>

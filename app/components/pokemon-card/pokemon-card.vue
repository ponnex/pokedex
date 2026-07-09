<template>
	<div
		class="relative inline-grid grid-cols-3 gap-x-4 rounded-2xl min-w-full h-24 2xl:h-44 text-white dark:text-black shadow cursor-pointer"
		:class="getBgColor()"
		@click="event => emit('click', event)"
	>
		<div class="justify-self-center self-center col-span-1">
			<svg
				v-show="!isImageLoaded"
				class="fill-current h-full p-3"
				width="104"
				height="104"
				viewBox="0 0 104 104"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle cx="52" cy="52" r="17" fill="currentColor" />
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M78.3309 58H103.658C100.683 83.8926 78.6896 104 52 104C25.3104 104 3.3172 83.8926 0.342407 58H25.669C28.3974 70.0239 39.1505 79 52 79C64.8495 79 75.6026 70.0239 78.3309 58ZM78.3309 46H103.658C100.683 20.1074 78.6896 0 52 0C25.3104 0 3.3172 20.1074 0.342407 46H25.669C28.3974 33.9761 39.1505 25 52 25C64.8495 25 75.6026 33.9761 78.3309 46Z"
					fill="currentColor"
				/>
			</svg>
			<img
				v-if="!isImageBroken"
				ref="pokemon-image"
				class="h-24 2xl:h-40 p-2 object-contain"
				:class="{ 'absolute opacity-0': !isImageLoaded }"
				:src="officialArtworkUrl(pokemon.id)"
				:alt="pokemon.name"
				loading="lazy"
				decoding="async"
				@load="onImageLoad()"
				@error="isImageBroken = true"
			>
		</div>
		<div class="flex flex-col col-span-2">
			<span class="text-2xl font-medium pt-2">{{ startCase(pokemon.name) }}</span>
			<pokemon-type-badge
				:types="pokemonTypes"
				:text-only="true"
			/>
		</div>
		<span class="absolute bottom-0 dark:text-gray-900 font-semibold leading-9 opacity-50 right-0 text-5xl text-white">{{ `#${padStart(String(pokemon.id), 3, '0')}` }}</span>
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
		default: () => { return {} as PokemonIndexEntry; },
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

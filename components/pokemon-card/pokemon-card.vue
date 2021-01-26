<template>
	<div
		class="relative inline-grid grid-cols-3 gap-x-4 rounded-2xl min-w-full h-24 text-white dark:text-black shadow-md"
		:class="getBgColor()"
		@click="event => this.$emit('click', event)"
	>
		<svg
			v-if="!detailsUpdated"
			class="fill-current h-full p-2 justify-self-center self-center col-span-1"
			width="100%"
			height="100%"
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid meet"
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
		<img v-else class="h-full p-2 justify-self-center self-center col-span-1" :src="pokemon.image" :alt="pokemon.name">
		<div class="flex flex-col col-span-2">
			<span class="text-2xl font-medium pt-2">{{ startCase(pokemon.name) }}</span>
			<pokemon-type-badge
				:types="pokemon.types"
			/>
		</div>
		<span v-if="detailsUpdated" class="absolute bottom-0 dark:text-gray-900 font-semibold leading-9 opacity-50 right-0 text-5xl text-white">{{ `#${padStart(pokemon.id, 3, '0')}` }}</span>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { Result } from '@/model/pokemon-list';

declare const _: any;

@Component
export default class PokemonCard extends Vue {
	@Prop({
		type: Object,
		default: () => { return {}; },
	}) pokemon!: Result;

	@Prop({
		type: Boolean,
		default: false,
	}) detailsUpdated!: Boolean;

	startCase: Function = _.startCase;
	padStart: Function = _.padStart;

	getBgColor() {
		const color = this.pokemon.color;
		if (!color) {
			return 'bg-gray-500';
		}
		if (color === 'white') {
			return 'bg-gray-500';
		} else if (color === 'brown') {
			return 'bg-yellow-800';
		} else {
			return color ? `bg-${color}-500` : '';
		}
	}
}
</script>

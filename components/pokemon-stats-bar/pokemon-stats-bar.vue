<template>
	<div class="bg-gray-200 dark:bg-gray-700 rounded-3xl my-1">
		<span class="block h-full rounded-3xl" :class="`bg-${barColor}`" :style="`width: ${statPercentage}%`"></span>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class PokemonStatsBar extends Vue {
	@Prop({
		type: Number,
		default: 0,
	}) stat!: number;

	@Prop({
		type: String,
		default: 'gray',
	}) barColor!: string;

	get statPercentage() {
		return (this.stat / 255) * 100;
	}
}
</script>

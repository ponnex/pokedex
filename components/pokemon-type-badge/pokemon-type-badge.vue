<template>
	<div class="inline-block space-x-2">
		<span v-for="(type, typeIdx) in types" :key="typeIdx">{{ type.type.name }}</span>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { Type } from '@/model/pokemon';

@Component
export default class PokemonTypeBadge extends Vue {
	@Prop({
		type: Array,
		default: () => { return []; },
	}) types!: Type[];

	@Prop({
		type: Boolean,
		default: false,
	}) full!: Boolean;
}
</script>

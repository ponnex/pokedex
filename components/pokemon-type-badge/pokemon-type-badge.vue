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
				:src="require(`@/assets/images/types/${type.type.name}.svg`)"
				@load="onImageLoad()"
			/>
			<span v-if="full" class="type-name font-bold text-white">{{ upperCase(type.type.name) }}</span>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { Type } from '@/model/pokemon';
declare const _: any;

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

	upperCase: Function = _.upperCase;
	isBadgeImageLoaded: boolean = false;

	onImageLoad() {
		this.isBadgeImageLoaded = true;
	}
}
</script>

<style lang="scss" scoped>
.type-name {
	font-size: 8px;
}
</style>

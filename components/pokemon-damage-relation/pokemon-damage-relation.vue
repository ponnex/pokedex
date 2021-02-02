<template>
	<div class="mt-5">
		<div v-if="damageType === 'strength'" class="flex flex-wrap gap-8">
			<div
				v-for="(strength, strengthIdx) in pokemonDamageRelations.strength"
				:key="strengthIdx"
				class="flex flex-col w-16"
			>
				<img
					class="p-2 gap-x-1 rounded-full h-10 self-center"
					:src="require(`@/assets/images/types/${strength.name}.svg`)"
					:class="`${strength.name}`"
				/>
				<span class="self-center">{{ strength.damage === 'double' ? '2' : '1/2' }}</span>
			</div>
		</div>
		<div v-else class="flex flex-wrap gap-8">
			<div
				v-for="(weakness, weaknessIdx) in pokemonDamageRelations.weakness"
				:key="weaknessIdx"
				class="flex flex-col w-16"
			>
				<img
					class="p-2 gap-x-1 rounded-full h-10 self-center"
					:src="require(`@/assets/images/types/${weakness.name}.svg`)"
					:class="`${weakness.name}`"
				/>
				<span class="self-center">{{ weakness.damage === 'double' ? '2' : '1/2' }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator';
import IdFromUrl from '@/utils/id-from-url';
import { Type } from '@/model/pokemon';
import { PokemonType, DamageRelations } from '@/model/pokemin-type';
declare const _: any;

@Component
export default class PokemonAbilityComponent extends mixins(IdFromUrl) {
	@Prop({
		type: Array,
		default: () => { return []; },
	}) types!: Type[];

	@Prop({
		type: String,
		default: 'strength',
	}) damageType!: string;

	damageRelations!: DamageRelations;

	get pokemonDamageRelations() {
		if (!Object.keys(this.$accessor.pokemon.pokemonDamangeRelation).length) {
			return {
				strength: [],
				weakness: [],
			};
		}
		const strengthDouble = this.$accessor.pokemon.pokemonDamangeRelation.doubleDamageTo.map((damage) => {
			return {
				...damage,
				damage: 'double',
			};
		});
		const strengthHalf = this.$accessor.pokemon.pokemonDamangeRelation.halfDamageTo.map((damage) => {
			return {
				...damage,
				damage: 'half',
			};
		});
		const weaknessDouble = this.$accessor.pokemon.pokemonDamangeRelation.doubleDamageFrom.map((damage) => {
			return {
				...damage,
				damage: 'double',
			};
		});
		const weaknessHalf = this.$accessor.pokemon.pokemonDamangeRelation.halfDamageFrom.map((damage) => {
			return {
				...damage,
				damage: 'half',
			};
		});

		const strength = _.concat(strengthDouble, strengthHalf);
		const weakness = _.concat(weaknessDouble, weaknessHalf);
		return { strength, weakness };
	}

	async fetch() {
		for (const type of this.types) {
			const typeId = this.idFromUrl(type.type.url);
			await this.$accessor.pokemon.getPokemonType(typeId);
		}

		const damageRelations: DamageRelations = _
			.chain(_.cloneDeep(this.$accessor.pokemon.pokemonType))
			.filter((pokemonType: PokemonType) => {
				const typeNames = _.map(this.types, (type: Type) => {
					return type.type.name;
				});
				return _.includes(typeNames, pokemonType.name);
			})
			.map((pokemonType: PokemonType) => {
				return pokemonType.damageRelations;
			})
			.reduce((accum: DamageRelations, damageRelations: DamageRelations) => {
				const { doubleDamageFrom, doubleDamageTo, halfDamageFrom, halfDamageTo } = accum as DamageRelations;

				return {
					doubleDamageFrom: _.uniqBy(_.concat(doubleDamageFrom, damageRelations.doubleDamageFrom), 'name'),
					doubleDamageTo: _.uniqBy(_.concat(doubleDamageTo, damageRelations.doubleDamageTo), 'name'),
					halfDamageFrom: _.uniqBy(_.concat(halfDamageFrom, damageRelations.halfDamageFrom), 'name'),
					halfDamageTo: _.uniqBy(_.concat(halfDamageTo, damageRelations.halfDamageTo), 'name'),
				};
			})
			.value();
		this.$accessor.pokemon.setPokemonDamageRelations(damageRelations);
	}
}
</script>

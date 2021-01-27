<template>
	<div class="mt-5">
		<div v-if="damageType === 'strength'">
			<div
				v-for="(strengths, strengthsIdx) in pokemonDamageRelations.strength"
				:key="strengthsIdx"
				class="grid grid-cols-5"
			>
				<div
					v-for="(strength, strengthIdx) in strengths"
					:key="strengthIdx"
				>
					<img
						class="flex p-2 gap-x-1 rounded-full h-10 self-center"
						:src="require(`@/assets/images/types/${strength.name}.svg`)"
						:class="`${strength.name}`"
					/>
					<span>{{ strengthsIdx === 'double' ? '2' : '1/2' }}</span>
				</div>
			</div>
		</div>
		<div v-else>
			<div
				v-for="(weaknesses, weaknessesIdx) in pokemonDamageRelations.weakness"
				:key="weaknessesIdx"
				class="grid grid-cols-5"
			>
				<div
					v-for="(weakness, weaknessIdx) in weaknesses"
					:key="weaknessIdx"
				>
					<img
						class="flex p-2 gap-x-1 rounded-full h-10 self-center"
						:src="require(`@/assets/images/types/${weakness.name}.svg`)"
						:class="`${weakness.name}`"
					/>
					<span>{{ weaknessesIdx === 'double' ? '2' : '1/2' }}</span>
				</div>
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
		const strengthDouble = this.$accessor.pokemon.pokemonDamangeRelation.doubleDamageTo;
		const strengthHalf = this.$accessor.pokemon.pokemonDamangeRelation.halfDamageTo;
		const weaknessDouble = this.$accessor.pokemon.pokemonDamangeRelation.doubleDamageFrom;
		const weaknessHalf = this.$accessor.pokemon.pokemonDamangeRelation.halfDamageFrom;

		const strength = { double: strengthDouble, half: strengthHalf };
		const weakness = { double: weaknessDouble, half: weaknessHalf };
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
					doubleDamageFrom: _.concat(doubleDamageFrom, damageRelations.doubleDamageFrom),
					doubleDamageTo: _.concat(doubleDamageTo, damageRelations.doubleDamageTo),
					halfDamageFrom: _.concat(halfDamageFrom, damageRelations.halfDamageFrom),
					halfDamageTo: _.concat(halfDamageTo, damageRelations.halfDamageTo),
				};
			})
			.value();
		this.$accessor.pokemon.setPokemonDamageRelations(damageRelations);
	}
}
</script>

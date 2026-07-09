import { defineStore } from 'pinia';
import { uniqBy } from 'lodash-es';
import type { MoveNamesResponse, MovePokemonResponse, PokemonIndexEntry, PokemonIndexResponse } from '~/types/pokemon-list';
import { GRAPHQL_API } from '~/types/constants';
import type { DamageRelationEntry, EvolutionStage, PokemonDetails, PokemonDetailsResponse } from '~/types/pokemon-details';

// Single GraphQL query returning everything the details page renders —
// replaces the pokemon/species/evolution-chain REST calls plus the
// per-ability and per-type calls the child components used to make
const POKEMON_DETAILS_QUERY = `query pokemonDetails($name: String!) {
	pokemon(where: {name: {_eq: $name}}) {
		id
		name
		height
		weight
		base_experience
		pokemonstats { base_stat stat { name } }
		pokemontypes {
			type {
				name
				typeefficacies { damage_factor targettype: TypeByTargetTypeId { name } }
				TypeefficaciesByTargetTypeId { damage_factor damagetype: type { name } }
			}
		}
		pokemonabilities { ability { name abilityeffecttexts(where: {language_id: {_eq: 9}}, limit: 1) { effect } } }
		pokemonmoves(where: {level: {_eq: 0}}, distinct_on: move_id) { move { name } }
		pokemonspecy {
			gender_rate
			is_legendary
			is_mythical
			pokemoncolor { name }
			growthrate { name }
			pokemonspeciesflavortexts(where: {language_id: {_eq: 9}}, limit: 1) { flavor_text }
			evolutionchain {
				pokemonspecies(order_by: {id: asc}) { id name evolves_from_species_id pokemonevolutions { min_level } }
			}
		}
	}
}`;

type RawPokemonDetails = PokemonDetailsResponse['data']['pokemon'][number];

const mapDamageRelations = (pokemontypes: RawPokemonDetails['pokemontypes']) => {
	const collect = (damage: DamageRelationEntry['damage'], factor: number, entries: { damage_factor: number; name: string }[]) => {
		return entries
			.filter(entry => entry.damage_factor === factor)
			.map(entry => ({ name: entry.name, damage }));
	};
	const damageTo = pokemontypes.flatMap(pokemonType => pokemonType.type.typeefficacies.map(efficacy => ({ damage_factor: efficacy.damage_factor, name: efficacy.targettype.name })));
	const damageFrom = pokemontypes.flatMap(pokemonType => pokemonType.type.TypeefficaciesByTargetTypeId.map(efficacy => ({ damage_factor: efficacy.damage_factor, name: efficacy.damagetype.name })));

	return {
		strength: [ ...uniqBy(collect('double', 200, damageTo), 'name'), ...uniqBy(collect('half', 50, damageTo), 'name') ],
		weakness: [ ...uniqBy(collect('double', 200, damageFrom), 'name'), ...uniqBy(collect('half', 50, damageFrom), 'name') ],
	};
};

const mapEvolutionStages = (raw: RawPokemonDetails): EvolutionStage[] => {
	const species = raw.pokemonspecy?.evolutionchain?.pokemonspecies ?? [];
	const speciesById = new Map(species.map(specy => [ specy.id, specy ]));
	return species.flatMap((specy) => {
		const evolveFrom = specy.evolves_from_species_id ? speciesById.get(specy.evolves_from_species_id) : undefined;
		if (!evolveFrom) {
			return [];
		}
		return [ {
			evolveFrom: { id: evolveFrom.id, name: evolveFrom.name },
			evolveTo: { id: specy.id, name: specy.name },
			minLevel: specy.pokemonevolutions[0]?.min_level ?? null,
		} ];
	});
};

const mapPokemonDetails = (raw: RawPokemonDetails): PokemonDetails => {
	const species = raw.pokemonspecy;
	return {
		id: raw.id,
		name: raw.name,
		height: raw.height,
		weight: raw.weight,
		baseExperience: raw.base_experience,
		types: raw.pokemontypes.map(pokemonType => pokemonType.type.name),
		stats: raw.pokemonstats.map(stat => ({ name: stat.stat.name, baseStat: stat.base_stat })),
		abilities: raw.pokemonabilities.map(pokemonAbility => ({
			name: pokemonAbility.ability.name,
			effect: pokemonAbility.ability.abilityeffecttexts[0]?.effect ?? '',
		})),
		moves: raw.pokemonmoves.map(pokemonMove => pokemonMove.move.name),
		description: species?.pokemonspeciesflavortexts[0]?.flavor_text ?? '',
		color: species?.pokemoncolor?.name ?? '',
		growthRate: species?.growthrate?.name ?? '',
		genderRate: species?.gender_rate ?? -1,
		isLegendary: species?.is_legendary ?? false,
		isMythical: species?.is_mythical ?? false,
		...mapDamageRelations(raw.pokemontypes),
		evolutionStages: mapEvolutionStages(raw),
	};
};

export const usePokemonStore = defineStore('pokemon', {
	state: () => ({
		pokemonIndex: [] as PokemonIndexEntry[],
		pokemonDetails: {} as Record<string, PokemonDetails>,
		moveNames: [] as string[],
		movePokemonIds: {} as Record<string, number[]>,
	}),
	actions: {
		// One GraphQL query returns id, name, types, and species color for every
		// Pokemon — replaces the two REST calls per card the list used to need
		async getPokemonIndex() {
			if (this.pokemonIndex.length) {
				return this.pokemonIndex;
			}
			try {
				const response = await $fetch<PokemonIndexResponse>(GRAPHQL_API, {
					method: 'POST',
					body: {
						query: '{ pokemon(order_by: {id: asc}) { id name pokemontypes { type { name } } pokemonspecy { generation_id is_legendary is_mythical is_baby pokemoncolor { name } } } }',
					},
				});
				this.pokemonIndex = response.data.pokemon.map(pokemon => ({
					id: pokemon.id,
					name: pokemon.name,
					types: pokemon.pokemontypes.map(pokemonType => pokemonType.type.name),
					color: pokemon.pokemonspecy?.pokemoncolor?.name ?? '',
					generation: pokemon.pokemonspecy?.generation_id ?? 0,
					isLegendary: pokemon.pokemonspecy?.is_legendary ?? false,
					isMythical: pokemon.pokemonspecy?.is_mythical ?? false,
					isBaby: pokemon.pokemonspecy?.is_baby ?? false,
				}));
				return this.pokemonIndex;
			}
			catch {
				return;
			}
		},
		// Full move-name list for the sidebar autocomplete (~900 names, one query)
		async getMoveNames() {
			if (this.moveNames.length) {
				return this.moveNames;
			}
			try {
				const response = await $fetch<MoveNamesResponse>(GRAPHQL_API, {
					method: 'POST',
					body: {
						query: '{ move(order_by: {name: asc}) { name } }',
					},
				});
				this.moveNames = response.data.move.map(move => move.name);
				return this.moveNames;
			}
			catch {
				return;
			}
		},
		// Ids of every Pokemon that can learn the move — cached per move
		async getMovePokemonIds(move: string) {
			if (this.movePokemonIds[move]) {
				return this.movePokemonIds[move];
			}
			try {
				const response = await $fetch<MovePokemonResponse>(GRAPHQL_API, {
					method: 'POST',
					body: {
						query: 'query movePokemon($name: String!) { move(where: {name: {_eq: $name}}) { pokemonmoves(distinct_on: pokemon_id) { pokemon_id } } }',
						variables: { name: move },
					},
				});
				const ids = response.data.move[0]?.pokemonmoves.map(pokemonMove => pokemonMove.pokemon_id) ?? [];
				this.movePokemonIds[move] = ids;
				return ids;
			}
			catch {
				return;
			}
		},
		async getPokemonDetails(name: string) {
			if (this.pokemonDetails[name]) {
				return this.pokemonDetails[name];
			}
			try {
				const response = await $fetch<PokemonDetailsResponse>(GRAPHQL_API, {
					method: 'POST',
					body: {
						query: POKEMON_DETAILS_QUERY,
						variables: { name },
					},
				});
				const raw = response.data.pokemon[0];
				if (!raw) {
					return;
				}
				const details = mapPokemonDetails(raw);
				this.pokemonDetails[name] = details;
				return details;
			}
			catch {
				return;
			}
		},
	},
});

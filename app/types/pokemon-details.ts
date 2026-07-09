// Everything the details page renders, mapped from the single PokeAPI
// GraphQL query — replaces the pokemon/species/evolution-chain/ability/type
// REST calls the page used to fan out
export interface DamageRelationEntry {
  name: string;
  damage: 'double' | 'half';
}

export interface EvolutionStageSpecies {
  id: number;
  name: string;
}

export interface EvolutionStage {
  evolveFrom: EvolutionStageSpecies;
  evolveTo: EvolutionStageSpecies;
  minLevel: number | null;
}

// One species in a flattened root→leaf evolution path; minLevelToNext
// belongs to the edge leading to the following node (null on the last)
export interface EvolutionPathNode {
  id: number;
  name: string;
  minLevelToNext: number | null;
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  baseExperience: number | null;
  types: string[];
  stats: { name: string; baseStat: number }[];
  abilities: { name: string; effect: string }[];
  moves: string[];
  description: string;
  color: string;
  growthRate: string;
  genderRate: number;
  isLegendary: boolean;
  isMythical: boolean;
  strength: DamageRelationEntry[];
  weakness: DamageRelationEntry[];
  evolutionStages: EvolutionStage[];
}

export interface PokemonDetailsResponse {
  data: {
    pokemon: {
      id: number;
      name: string;
      height: number;
      weight: number;
      base_experience: number | null;
      pokemonstats: { base_stat: number; stat: { name: string } }[];
      pokemontypes: {
        type: {
          name: string;
          typeefficacies: { damage_factor: number; targettype: { name: string } }[];
          TypeefficaciesByTargetTypeId: { damage_factor: number; damagetype: { name: string } }[];
        };
      }[];
      pokemonabilities: { ability: { name: string; abilityeffecttexts: { effect: string }[] } }[];
      pokemonmoves: { move: { name: string } }[];
      pokemonspecy?: {
        gender_rate: number;
        is_legendary: boolean;
        is_mythical: boolean;
        pokemoncolor?: { name: string };
        growthrate?: { name: string };
        pokemonspeciesflavortexts: { flavor_text: string }[];
        evolutionchain?: {
          pokemonspecies: {
            id: number;
            name: string;
            evolves_from_species_id: number | null;
            pokemonevolutions: { min_level: number | null }[];
          }[];
        };
      };
    }[];
  };
}

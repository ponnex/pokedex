export interface PokemonList {
  name: string;
  url: string;
}

// Slim per-Pokemon record from the PokeAPI GraphQL index query —
// everything a list card and the filters need without per-card REST calls
export interface PokemonIndexEntry {
  id: number;
  name: string;
  types: string[];
  color: string;
  generation: number;
  isLegendary: boolean;
  isMythical: boolean;
  isBaby: boolean;
}

export type PokemonCategory = 'legendary' | 'mythical' | 'baby';

export interface PokemonFilters {
  types: string[];
  generations: number[];
  categories: PokemonCategory[];
}

export interface PokemonIndexResponse {
  data: {
    pokemon: {
      id: number;
      name: string;
      pokemontypes: { type: { name: string } }[];
      pokemonspecy?: {
        generation_id?: number;
        is_legendary?: boolean;
        is_mythical?: boolean;
        is_baby?: boolean;
        pokemoncolor?: { name: string };
      };
    }[];
  };
}
export interface PokemonListResponse {
  count: number;
  next: string;
  previous?: any;
  results: PokemonList[];
}

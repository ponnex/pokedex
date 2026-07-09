export interface PokemonList {
  name: string;
  url: string;
}

// Slim per-Pokemon record from the PokeAPI GraphQL index query —
// everything a list card needs without per-card REST calls
export interface PokemonIndexEntry {
  id: number;
  name: string;
  types: string[];
  color: string;
}

export interface PokemonIndexResponse {
  data: {
    pokemon: {
      id: number;
      name: string;
      pokemontypes: { type: { name: string } }[];
      pokemonspecy?: { pokemoncolor?: { name: string } };
    }[];
  };
}
export interface PokemonListResponse {
  count: number;
  next: string;
  previous?: any;
  results: PokemonList[];
}

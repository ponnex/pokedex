export interface PokemonList {
  name: string;
  url: string;
}
export interface PokemonListResponse {
  count: number;
  next: string;
  previous?: any;
  results: PokemonList[];
}

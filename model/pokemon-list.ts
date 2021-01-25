export interface Result {
  name: string;
  url: string;
  image?: string | null;
  id?: number;
}

export interface PokemonList {
  count: number;
  next: string;
  previous?: any;
  results: Result[];
}

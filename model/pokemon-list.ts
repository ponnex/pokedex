import { Type } from './pokemon';
export interface Result {
  name: string;
  url: string;
  image?: string | null;
  id?: number;
  types?: Type[];
  color?: string;
}
export interface PokemonList {
  count: number;
  next: string;
  previous?: any;
  results: Result[];
}
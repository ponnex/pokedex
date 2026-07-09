export interface DoubleDamageFrom {
  name: string;
  url: string;
}

export interface DamageRelations {
  doubleDamageFrom: DoubleDamageFrom[];
  doubleDamageTo: DoubleDamageFrom[];
  halfDamageFrom: DoubleDamageFrom[];
  halfDamageTo: DoubleDamageFrom[];
  noDamageFrom: any[];
  noDamageTo: DoubleDamageFrom[];
}

export interface GameIndex {
  gameIndex: number;
  generation: DoubleDamageFrom;
}

export interface Name {
  language: DoubleDamageFrom;
  name: string;
}

export interface Pokemon {
  pokemon: DoubleDamageFrom;
  slot: number;
}

export interface PokemonType {
  damageRelations: DamageRelations;
  gameIndices: GameIndex[];
  generation: DoubleDamageFrom;
  id: number;
  moveDamageClass: DoubleDamageFrom;
  moves: DoubleDamageFrom[];
  name: string;
  names: Name[];
  pokemon: Pokemon[];
}

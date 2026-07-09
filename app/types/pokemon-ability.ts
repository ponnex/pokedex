export interface Language {
  name: string;
  url: string;
}

export interface EffectEntry {
  effect: string;
  language: Language;
}

export interface EffectChange {
  effectEntries: EffectEntry[];
  versionGroup: Language;
}

export interface EffectEntry2 {
  effect: string;
  language: Language;
  shortEffect: string;
}

export interface FlavorTextEntry {
  flavorText: string;
  language: Language;
  versionGroup: Language;
}

export interface Name {
  language: Language;
  name: string;
}

export interface Pokemon {
  isHidden: boolean;
  pokemon: Language;
  slot: number;
}

export interface PokemonAbility {
  effectChanges: EffectChange[];
  effectEntries: EffectEntry2[];
  flavorTextEntries: FlavorTextEntry[];
  generation: Language;
  id: number;
  isMainSeries: boolean;
  name: string;
  names: Name[];
  pokemon: Pokemon[];
}

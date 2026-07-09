export interface Color {
  name: string;
  url: string;
}

export interface EvolutionChain {
  url: string;
}

export interface FlavorTextEntry {
  flavorText: string;
  language: Color;
  version: Color;
}

export interface Genus {
  genus: string;
  language: Color;
}

export interface Name {
  language: Color;
  name: string;
}

export interface PalParkEncounter {
  area: Color;
  baseScore: number;
  rate: number;
}

export interface PokedexNumber {
  entryNumber: number;
  pokedex: Color;
}

export interface Variety {
  isDefault: boolean;
  pokemon: Color;
}

export interface PokemonSpecies {
  baseHappiness: number;
  captureRate: number;
  color: Color;
  eggGroups: Color[];
  evolutionChain: EvolutionChain;
  evolvesFromSpecies?: any;
  flavorTextEntries: FlavorTextEntry[];
  formDescriptions: any[];
  formsSwitchable: boolean;
  genderRate: number;
  genera: Genus[];
  generation: Color;
  growthRate: Color;
  habitat: Color;
  hasGenderDifferences: boolean;
  hatchCounter: number;
  id: number;
  isBaby: boolean;
  isLegendary: boolean;
  isMythical: boolean;
  name: string;
  names: Name[];
  order: number;
  palParkEncounters: PalParkEncounter[];
  pokedexNumbers: PokedexNumber[];
  shape: Color;
  varieties: Variety[];
}

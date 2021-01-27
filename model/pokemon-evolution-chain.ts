export interface Trigger {
  name: string;
  url: string;
}

export interface EvolutionDetail {
  gender?: any;
  heldItem?: any;
  item?: any;
  knownMove?: any;
  knownMoveType?: any;
  location?: any;
  minAffection?: any;
  minBeauty?: any;
  minHappiness?: any;
  minLevel: number;
  needsOverworldRain: boolean;
  partySpecies?: any;
  partyType?: any;
  relativePhysicalStats?: any;
  timeOfDay: string;
  tradeSpecies?: any;
  trigger: Trigger;
  turnUpsideDown: boolean;
}

export interface EvolvesTo {
  evolutionDetails: EvolutionDetail[];
  evolvesTo: any[];
  isBaby: boolean;
  species: Trigger;
}

export interface EvolvesTo2 {
  evolutionDetails: EvolutionDetail[];
  evolvesTo: EvolvesTo[];
  isBaby: boolean;
  species: Trigger;
}

export interface Chain {
  evolutionDetails: any[];
  evolvesTo: EvolvesTo2[];
  isBaby: boolean;
  species: Trigger;
}

export interface PokemonEvolutionChain {
  babyTriggerItem?: any;
  chain: Chain;
  id: number;
}

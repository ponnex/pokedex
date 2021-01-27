export interface Ability {
  name: string;
  url: string;
}

export interface Ability2 {
  ability: Ability;
  isHidden: boolean;
  slot: number;
}

export interface GameIndex {
  gameIndex: number;
  version: Ability;
}

export interface VersionGroupDetail {
  levelLearnedAt: number;
  moveLearnMethod: Ability;
  versionGroup: Ability;
}

export interface Move {
  move: Ability;
  versionGroupDetails: VersionGroupDetail[];
}

export interface DreamWorld {
  frontDefault: string;
  frontFemale?: any;
}

export interface OfficialArtwork {
  frontDefault: string;
}

export interface Other {
  dreamWorld: DreamWorld;
  officialArtwork: OfficialArtwork;
}

export interface RedBlue {
  backDefault: string;
  backGray: string;
  frontDefault: string;
  frontGray: string;
}

export interface GenerationI {
  redBlue: RedBlue;
  yellow: RedBlue;
}

export interface Crystal {
  backDefault: string;
  backShiny: string;
  frontDefault: string;
  frontShiny: string;
}

export interface GenerationIi {
  crystal: Crystal;
  gold: Crystal;
  silver: Crystal;
}

export interface Emerald {
  frontDefault: string;
  frontShiny: string;
}

export interface GenerationIii {
  emerald: Emerald;
  fireredLeafgreen: Crystal;
  rubySapphire: Crystal;
}

export interface DiamondPearl {
  backDefault: string;
  backFemale?: any;
  backShiny: string;
  backShinyFemale?: any;
  frontDefault: string;
  frontFemale?: any;
  frontShiny: string;
  frontShinyFemale?: any;
}

export interface GenerationIv {
  diamondPearl: DiamondPearl;
  heartgoldSoulsilver: DiamondPearl;
  platinum: DiamondPearl;
}

export interface BlackWhite {
  animated: DiamondPearl;
  backDefault: string;
  backFemale?: any;
  backShiny: string;
  backShinyFemale?: any;
  frontDefault: string;
  frontFemale?: any;
  frontShiny: string;
  frontShinyFemale?: any;
}

export interface GenerationV {
  blackWhite: BlackWhite;
}

export interface OmegarubyAlphasapphire {
  frontDefault: string;
  frontFemale?: any;
  frontShiny: string;
  frontShinyFemale?: any;
}

export interface GenerationVi {
  omegarubyAlphasapphire: OmegarubyAlphasapphire;
  xY: OmegarubyAlphasapphire;
}

export interface GenerationVii {
  icons: DreamWorld;
  ultraSunUltraMoon: OmegarubyAlphasapphire;
}

export interface GenerationViii {
  icons: DreamWorld;
}

export interface Versions {
  generationI: GenerationI;
  generationIi: GenerationIi;
  generationIii: GenerationIii;
  generationIv: GenerationIv;
  generationV: GenerationV;
  generationVi: GenerationVi;
  generationVii: GenerationVii;
  generationViii: GenerationViii;
}

export interface Sprites {
  backDefault: string;
  backFemale?: any;
  backShiny: string;
  backShinyFemale?: any;
  frontDefault: string;
  frontFemale?: any;
  frontShiny: string;
  frontShinyFemale?: any;
  other: Other;
  versions: Versions;
}

export interface Stat {
  baseStat: number;
  effort: number;
  stat: Ability;
}

export interface Type {
  slot: number;
  type: Ability;
}

export interface Pokemon {
  abilities: Ability2[];
  baseExperience: number;
  forms: Ability[];
  gameIndices: GameIndex[];
  height: number;
  heldItems: any[];
  id: number;
  isDefault: boolean;
  locationAreaEncounters: string;
  moves: Move[];
  name: string;
  order: number;
  species: Ability;
  sprites: Sprites;
  stats: Stat[];
  types: Type[];
  weight: number;
}

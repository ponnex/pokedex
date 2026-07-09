// Slim remnant of the old REST /pokemon response types — only the shape the
// type-badge component still consumes (details data now comes from GraphQL)
export interface NamedResource {
  name: string;
  url: string;
}

export interface Type {
  slot: number;
  type: NamedResource;
}

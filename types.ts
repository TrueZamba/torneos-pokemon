// types.ts
export interface Pokemon {
  species: string;
  item: string | null;
  ability: string | null;
  teraType: string | null;
  moves: string[];
  spriteUrl?: string; // Lo rellenaremos con la PokéAPI
  types?: string[];   // Lo rellenaremos con la PokéAPI
}

export interface Player {
  id: string;
  name: string;
  team: Pokemon[];
}
// lib/pokeapi.ts
export async function getPokemonDetails(species: string) {
  // Limpiamos el nombre para la API (minúsculas y sin espacios)
  const cleanName = species.toLowerCase().replace(' ', '-');
  
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${cleanName}`);
    if (!res.ok) return null;
    
    const data = await res.json();
    return {
      spriteUrl: data.sprites.front_default,
      types: data.types.map((t: any) => t.type.name)
    };
  } catch (error) {
    console.error("Error buscando a " + species);
    return null;
  }
}
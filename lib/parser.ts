// lib/parser.ts
import { Pokemon } from '../types';

export function parseShowdownText(text: string): Pokemon[] {
  // Separamos el texto por dobles saltos de línea (cada bloque es un Pokémon)
  const blocks = text.trim().split(/\n\n+/);
  const team: Pokemon[] = [];

  blocks.forEach(block => {
    const lines = block.split('\n').map(line => line.trim());
    if (lines.length === 0) return;

    // La primera línea tiene la especie y el objeto (ej: "Incineroar @ Sitrus Berry")
    const firstLine = lines[0];
    const speciesPart = firstLine.split('@')[0].trim();
    // Quitamos género si lo tiene (ej: " (M)")
    const species = speciesPart.replace(/\s*\([MF]\)\s*/g, ''); 
    const item = firstLine.includes('@') ? firstLine.split('@')[1].trim() : null;

    let ability = null;
    let teraType = null;
    const moves: string[] = [];

    // Leemos el resto de líneas
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('Ability:')) ability = line.replace('Ability:', '').trim();
      if (line.startsWith('Tera Type:')) teraType = line.replace('Tera Type:', '').trim();
      if (line.startsWith('- ')) moves.push(line.replace('- ', '').trim());
    }

    team.push({ species, item, ability, teraType, moves });
  });

  return team;
}
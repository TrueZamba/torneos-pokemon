// app/page.tsx
'use client';
import { useState } from 'react';
import { parseShowdownText } from '../lib/parser';
import { getPokemonDetails } from '../lib/pokeapi';
import { Pokemon } from '../types';
import { motion } from 'framer-motion';

export default function Home() {
  const [paste, setPaste] = useState('');
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);

  const handleProcessTeam = async () => {
    setLoading(true);
    const parsedTeam = parseShowdownText(paste);
    
    // Buscamos las imágenes en la PokeAPI para cada Pokémon
    const teamWithImages = await Promise.all(parsedTeam.map(async (p) => {
      const apiData = await getPokemonDetails(p.species);
      return { ...p, spriteUrl: apiData?.spriteUrl, types: apiData?.types };
    }));

    setTeam(teamWithImages);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Gestor de Torneos
      </h1>
      
      <div className="mb-8">
        <textarea 
          className="w-full h-40 p-4 bg-slate-800 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500"
          placeholder="Pega aquí el texto de Pokémon Showdown..."
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
        />
        <button 
          onClick={handleProcessTeam}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
        >
          {loading ? 'Cargando datos...' : 'Generar Equipo'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((poke, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index} 
            className="bg-slate-800 p-5 rounded-2xl border border-slate-700 hover:border-blue-400 transition-all shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
              <h2 className="text-xl font-bold capitalize">{poke.species}</h2>
              {poke.spriteUrl && <img src={poke.spriteUrl} alt={poke.species} className="w-16 h-16" />}
            </div>
            <ul className="text-sm text-slate-300 space-y-1">
              <li><span className="font-semibold text-blue-400">Objeto:</span> {poke.item || 'Ninguno'}</li>
              <li><span className="font-semibold text-blue-400">Habilidad:</span> {poke.ability}</li>
              <li><span className="font-semibold text-blue-400">Tera:</span> {poke.teraType}</li>
            </ul>
            <div className="mt-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Movimientos</h3>
              <div className="grid grid-cols-2 gap-2">
                {poke.moves.map((move, mIndex) => (
                  <span key={mIndex} className="bg-slate-700 px-2 py-1 rounded-md text-xs text-center border border-slate-600">
                    {move}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
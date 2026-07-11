'use client';
import { useState } from 'react';
import { parseShowdownText } from '../lib/parser';
import { getPokemonDetails } from '../lib/pokeapi';
import { Pokemon, Player } from '../types';
import { motion } from 'framer-motion';

export default function Home() {
  // Ahora guardamos una LISTA de jugadores, no solo un equipo
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [paste, setPaste] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para obtener la imagen del objeto
  const getItemSprite = (item: string | null) => {
    if (!item) return null;
    // Convierte "Choice Scarf" en "choice-scarf" para buscar su imagen oficial
    const cleanItem = item.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${cleanItem}.png`;
  };

  const handleAddPlayer = async () => {
    if (!playerName || !paste) return alert("¡Pon un nombre y pega el equipo!");
    setLoading(true);
    
    const parsedTeam = parseShowdownText(paste);
    
    const teamWithImages = await Promise.all(parsedTeam.map(async (p) => {
      const apiData = await getPokemonDetails(p.species);
      return { 
        ...p, 
        spriteUrl: apiData?.spriteUrl, 
        types: apiData?.types,
        itemSpriteUrl: getItemSprite(p.item) // Añadimos la imagen del objeto
      };
    }));

    // Creamos al nuevo jugador
    const newPlayer: Player = {
      id: crypto.randomUUID(), // Genera un ID único temporal
      name: playerName,
      team: teamWithImages
    };

    // Añadimos el nuevo jugador a la lista de los que ya existían
    setPlayers([...players, newPlayer]);
    
    // Limpiamos el formulario para el siguiente jugador
    setPlayerName('');
    setPaste('');
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Gestor de Torneos
      </h1>
      
      {/* Panel de Control del Organizador */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-12 max-w-2xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">📋</span> Añadir Jugador al Torneo
        </h2>
        <input 
          type="text"
          placeholder="Nombre del entrenador (ej. KastyTP)"
          className="w-full p-3 mb-4 bg-slate-900 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <textarea 
          className="w-full h-32 p-3 bg-slate-900 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          placeholder="Pega aquí el texto de Pokémon Showdown..."
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
        />
        <button 
          onClick={handleAddPlayer}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {loading ? 'Procesando Equipo...' : 'Registrar Jugador'}
        </button>
      </div>

      {/* Lista de Participantes del Torneo */}
      <div className="space-y-16">
        {players.map((player) => (
          <div key={player.id} className="border-t border-slate-700 pt-10">
            <h2 className="text-3xl font-bold mb-8 text-blue-400 flex items-center gap-3">
              <span>👤</span> {player.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {player.team.map((poke, index) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  key={index} 
                  className="bg-slate-800 p-5 rounded-2xl border border-slate-700 hover:border-blue-400 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
                    <h3 className="text-xl font-bold capitalize">{poke.species}</h3>
                    {poke.spriteUrl && <img src={poke.spriteUrl} alt={poke.species} className="w-16 h-16 object-contain drop-shadow-md" />}
                  </div>
                  <ul className="text-sm text-slate-300 space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="font-semibold text-blue-400">Objeto:</span> 
                      {poke.item || 'Ninguno'}
                      {/* Aquí se renderiza la imagen del objeto */}
                      {poke.itemSpriteUrl && (
                        <img src={poke.itemSpriteUrl} alt={poke.item || 'Objeto'} className="w-6 h-6 inline-block" />
                      )}
                    </li>
                    <li><span className="font-semibold text-blue-400">Habilidad:</span> {poke.ability}</li>
                    <li><span className="font-semibold text-blue-400">Tera:</span> {poke.teraType}</li>
                  </ul>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Movimientos</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {poke.moves.map((move, mIndex) => (
                        <span key={mIndex} className="bg-slate-700 px-2 py-1 rounded-md text-xs text-center border border-slate-600 truncate">
                          {move}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        
        {players.length === 0 && (
          <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-700 rounded-2xl">
            <p className="text-xl">No hay jugadores registrados en este torneo todavía.</p>
            <p className="text-sm mt-2">Usa el panel de arriba para añadir al primer participante.</p>
          </div>
        )}
      </div>
    </main>
  );
}

import React, { useState } from 'react';
import api from '../services/api';

// Clasificaciones de edad reales de las películas
const REAL_AGE_RATINGS = {
    // TP (Todos los públicos - 0)
    'El viaje de Chihiro': 0, 'Your Name': 0, 'Coco': 0, 'Toy Story 4': 0,
    'Ratatouille': 0, 'Up': 0, 'Buscando a Nemo': 0, 'Los Increíbles': 0,
    'Shrek': 0, 'E.T. el extraterrestre': 0,

    // +7
    'Spider-Man: Un nuevo universo': 7, 'Harry Potter y la piedra filosofal': 7,
    'Regreso al futuro': 7, 'Indiana Jones: En busca del arca perdida': 7,
    'Star Wars: Una nueva esperanza': 7, 'Star Wars: El Imperio contraataca': 7,
    'Star Wars: El Retorno del Jedi': 7, 'El Hobbit: Un viaje inesperado': 7,
    'Piratas del Caribe: La maldición del Perla Negra': 7, 'Jurassic Park': 7,
    'Shazam!': 7, 'Wonder Woman': 7, 'Guardianes de la Galaxia': 7,
    'Thor: Ragnarok': 7, 'Spider-Man: No Way Home': 7, 'Black Panther': 7,
    'Avengers: Endgame': 7,

    // +12
    'Oppenheimer': 12, 'Top Gun: Maverick': 12, 'Avatar: El sentido del agua': 12,
    'Gladiator': 12, 'Matrix': 12, 'Origen': 12, 'El caballero oscuro': 12,
    'Interstellar': 12, 'Arrival': 12, 'Ex Machina': 12, 'Her': 12, 'Gravity': 12,
    'The Martian': 12, 'Edge of Tomorrow': 12, 'Terminator 2': 12, 'Blade Runner 2049': 12,
    'Titanic': 12, 'Forrest Gump': 12, 'Una mente maravillosa': 12, 'El discurso del rey': 12,
    'Green Book': 12, 'La La Land': 12, 'Whiplash': 12,
    'El Señor de los Anillos: La Comunidad': 12, 'El Señor de los Anillos: Las Dos Torres': 12,
    'El Señor de los Anillos: El Retorno del Rey': 12, 'Harry Potter y las Reliquias de la Muerte 2': 12,
    'Rocky': 12, 'Dune: Parte Dos': 12, 'Avatar: Fuego y ceniza': 12, 'District 9': 12,
    'Ciudadano Kane': 12, 'Casablanca': 12, 'Lo que el viento se llevó': 12,
    'Orgullo y prejuicio': 12, 'Crazy Rich Asians': 12, 'Notting Hill': 12,
    'Pretty Woman': 12, 'El diario de Noah': 12, 'Love Actually': 12,
    'Un lugar en silencio': 12, 'Get Out': 12, 'Parásitos': 12,

    // +16
    'Midsommar': 16, 'John Wick 4': 16, 'Mad Max: Furia en la carretera': 16,
    'El Padrino': 16, 'Pulp Fiction': 16, 'Cadena perpetua': 16, 'El club de la lucha': 16,
    'El silencio de los corderos': 16, 'Psicosis': 16, 'El lobo de Wall Street': 16,
    'El renacido': 16, '12 años de esclavitud': 16, 'El pianista': 16, 'El Resplandor': 16,
    'Hereditary': 16, 'It': 16, 'El conjuro': 16, 'Seven': 16, 'Zodiac': 16,
    'Joker': 16, 'Logan': 16, 'Superbad': 16, 'Resacón en Las Vegas': 16,
    'Boda en Tailandia': 16, 'Django Unchained': 16, 'Inglourious Basterds': 16,
    'La lista de Schindler': 16, 'Salvar al soldado Ryan': 16,

    // +18
    'El exorcista': 18, 'Kill Bill: Volumen 1': 18, 'Deadpool': 18
};

const UpdateAgeRatings = () => {
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);
    const [running, setRunning] = useState(false);
    const [results, setResults] = useState([]);

    const updateAllRatings = async () => {
        setRunning(true);
        setStatus('Cargando películas...');
        setResults([]);

        try {
            const res = await api.get('/peliculas');
            const movies = res.data;
            setTotal(movies.length);
            setProgress(0);

            const newResults = [];

            for (let i = 0; i < movies.length; i++) {
                const movie = movies[i];
                const realAge = REAL_AGE_RATINGS[movie.titulo];

                setStatus(`Procesando: ${movie.titulo} (${i + 1}/${movies.length})`);

                if (realAge !== undefined && realAge !== movie.edadMinima) {
                    try {
                        await api.patch(`/peliculas/${movie.id}/edad`, { edadMinima: realAge });
                        newResults.push({ titulo: movie.titulo, oldAge: movie.edadMinima, newAge: realAge, status: 'ok' });
                    } catch (err) {
                        newResults.push({ titulo: movie.titulo, oldAge: movie.edadMinima, newAge: realAge, status: 'error' });
                    }
                } else if (realAge === undefined) {
                    newResults.push({ titulo: movie.titulo, oldAge: movie.edadMinima, newAge: movie.edadMinima, status: 'unknown' });
                } else {
                    newResults.push({ titulo: movie.titulo, oldAge: movie.edadMinima, newAge: realAge, status: 'unchanged' });
                }

                setProgress(i + 1);
                setResults([...newResults]);
            }

            setStatus('¡Completado!');
        } catch (error) {
            console.error(error);
            setStatus('Error: ' + error.message);
        } finally {
            setRunning(false);
        }
    };

    const getAgeLabel = (edad) => {
        const labels = { 0: 'TP', 7: '+7', 12: '+12', 16: '+16', 18: '+18' };
        return labels[edad] || `${edad}`;
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-6" style={{ backgroundColor: '#0F171E' }}>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Actualizar Clasificaciones de Edad</h1>

                <p className="mb-6" style={{ color: '#8197A4' }}>
                    Este proceso asignará las clasificaciones de edad reales a todas las películas del catálogo.
                </p>

                <button
                    onClick={updateAllRatings}
                    disabled={running}
                    className="px-6 py-3 rounded-lg font-semibold mb-8 transition-all"
                    style={{
                        backgroundColor: running ? '#425265' : '#00A8E1',
                        color: 'white',
                        cursor: running ? 'not-allowed' : 'pointer'
                    }}
                >
                    {running ? 'Procesando...' : 'Iniciar Actualización'}
                </button>

                {status && (
                    <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#1A242F' }}>
                        <p className="text-white">{status}</p>
                        {total > 0 && (
                            <div className="mt-2">
                                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#425265' }}>
                                    <div
                                        className="h-full transition-all"
                                        style={{ width: `${(progress / total) * 100}%`, backgroundColor: '#00A8E1' }}
                                    />
                                </div>
                                <p className="text-sm mt-1" style={{ color: '#8197A4' }}>
                                    {progress} / {total} películas procesadas
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {results.length > 0 && (
                    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#1A242F' }}>
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #425265' }}>
                                    <th className="p-3 text-left text-white">Película</th>
                                    <th className="p-3 text-center text-white">Antes</th>
                                    <th className="p-3 text-center text-white">Después</th>
                                    <th className="p-3 text-center text-white">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((r, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #425265' }}>
                                        <td className="p-3 text-white">{r.titulo}</td>
                                        <td className="p-3 text-center" style={{ color: '#8197A4' }}>{getAgeLabel(r.oldAge)}</td>
                                        <td className="p-3 text-center text-white">{getAgeLabel(r.newAge)}</td>
                                        <td className="p-3 text-center">
                                            {r.status === 'ok' && <span style={{ color: '#22c55e' }}>✓ Actualizado</span>}
                                            {r.status === 'unchanged' && <span style={{ color: '#8197A4' }}>Sin cambios</span>}
                                            {r.status === 'unknown' && <span style={{ color: '#f97316' }}>⚠ No encontrada</span>}
                                            {r.status === 'error' && <span style={{ color: '#ef4444' }}>✗ Error</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateAgeRatings;

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getMovieImages } from '../services/tmdb';
import { Link, useSearchParams } from 'react-router-dom';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    // Get current profile to check if it's a kids profile
    const currentProfile = JSON.parse(localStorage.getItem('currentProfile'));
    const isKidsProfile = currentProfile?.isKids || false;

    // Filters
    const [query, setQuery] = useState(initialQuery);
    const [categoriaId, setCategoriaId] = useState('');
    const [year, setYear] = useState('');
    const [rating, setRating] = useState('');

    // Data
    const [peliculas, setPeliculas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [failedImages, setFailedImages] = useState(new Set());
    const [fallbackImages, setFallbackImages] = useState({});

    // Load available categories
    useEffect(() => {
        api.get('/categorias')
            .then(res => setCategorias(res.data))
            .catch(err => console.error("Error cargando categorías:", err));
    }, []);

    // Effect to fetch from TMDB only for failed images
    useEffect(() => {
        if (failedImages.size === 0) return;

        failedImages.forEach(movieId => {
            // Avoid re-fetching if we already have a fallback or are fetching
            if (fallbackImages[movieId]) return;

            const movie = peliculas.find(p => p.id === movieId);
            if (movie) {
                getMovieImages(movie.titulo).then(data => {
                    if (data && data.poster) {
                        setFallbackImages(prev => ({
                            ...prev,
                            [movieId]: data.poster
                        }));
                    }
                });
            }
        });
    }, [failedImages, peliculas, fallbackImages]);

    // Perform Search
    useEffect(() => {
        // Debounce search to prevent flashing
        const timer = setTimeout(() => {
            fetchResults();
        }, 300);
        return () => clearTimeout(timer);
    }, [query, categoriaId, year, rating]);

    // Sync URL with query
    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const params = {};
            if (query) params.query = query;
            if (categoriaId) params.categoriaId = categoriaId;
            if (year) params.year = year;
            if (rating) params.rating = rating;

            const res = await api.get('/peliculas/search', { params });
            // Filter for kids profile - only show movies with edadMinima <= 7
            const movies = isKidsProfile
                ? res.data.filter(p => (p.edadMinima ?? 12) <= 7)
                : res.data;
            setPeliculas(movies);
            setFailedImages(new Set()); // Reset failures on new search
            setFallbackImages({});
        } catch (error) {
            console.error("Error buscando:", error);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (movie) => {
        // 1. Try fallback (TMDB) first if available
        if (fallbackImages[movie.id]) return fallbackImages[movie.id];

        // 2. Try backend URL
        if (movie.imagenUrl && movie.imagenUrl.startsWith('http') && !failedImages.has(movie.id)) {
            return movie.imagenUrl;
        }

        // 3. Last resort placeholder
        return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgMzAwIDQ1MCI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMyMDMwNDAiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMjQiPk5vIENvdmVyPC90ZXh0Pgo8L3N2Zz4=";
    };

    const handleImageError = (movie) => {
        if (!failedImages.has(movie.id)) {
            setFailedImages(prev => new Set(prev).add(movie.id));
        }
    };

    return (
        <div className="min-h-screen pt-20 px-6 lg:px-10 pb-10" style={{ backgroundColor: '#0F171E' }}>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* FILTERS SIDEBAR */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="sticky top-24 space-y-6 p-6 rounded-xl" style={{ backgroundColor: '#1A242F', border: '1px solid #425265' }}>
                        <h2 className="text-xl font-bold text-white mb-4">Filtros</h2>

                        {/* Genre */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#8197A4]">Género</label>
                            <select
                                value={categoriaId}
                                onChange={(e) => setCategoriaId(e.target.value)}
                                className="w-full p-2 rounded bg-[#0F171E] text-white border border-[#425265] focus:border-[#00A8E1] focus:outline-none"
                            >
                                <option value="">Todos</option>
                                {categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Year */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#8197A4]">Año</label>
                            <input
                                type="number"
                                placeholder="Ej: 2023"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full p-2 rounded bg-[#0F171E] text-white border border-[#425265] focus:border-[#00A8E1] focus:outline-none"
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#8197A4]">Valoración</label>
                            <select
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                className="w-full p-2 rounded bg-[#0F171E] text-white border border-[#425265] focus:border-[#00A8E1] focus:outline-none"
                            >
                                <option value="">Cualquiera</option>
                                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                <option value="4">⭐⭐⭐⭐ (4)</option>
                                <option value="3">⭐⭐⭐ (3)</option>
                                <option value="2">⭐⭐ (2)</option>
                                <option value="1">⭐ (1)</option>
                            </select>
                        </div>

                        <button
                            onClick={() => { setCategoriaId(''); setYear(''); setRating(''); setQuery(''); setSearchParams({}); }}
                            className="w-full py-2 text-sm font-medium text-[#00A8E1] hover:text-white transition-colors"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>

                {/* RESULTS GRID */}
                <div className="flex-1">
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Buscar título..."
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSearchParams(prev => {
                                    if (e.target.value) prev.set('q', e.target.value);
                                    else prev.delete('q');
                                    return prev;
                                });
                            }}
                            className="w-full p-4 rounded-xl text-lg bg-[#1A242F] text-white border border-[#425265] focus:border-[#00A8E1] focus:outline-none placeholder-[#8197A4]"
                        />
                    </div>

                    {loading ? (
                        <div className="flex justify-center mt-20">
                            <div className="w-12 h-12 rounded-full animate-spin border-4 border-[#00A8E1] border-t-transparent"></div>
                        </div>
                    ) : (
                        <>
                            <p className="text-[#8197A4] mb-4">{peliculas.length} resultados encontrados</p>

                            {peliculas.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {peliculas.map(pelicula => (
                                        <Link key={pelicula.id} to={`/peliculas/${pelicula.id}`} className="block group">
                                            <div className="relative rounded-lg overflow-hidden aspect-[2/3] mb-3 shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-[rgba(0,168,225,0.2)]">
                                                <img
                                                    src={getImageUrl(pelicula)}
                                                    alt={pelicula.titulo}
                                                    className="w-full h-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                    onError={() => handleImageError(pelicula)}
                                                />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <span className="bg-[#00A8E1] text-white px-4 py-2 rounded font-bold">Ver Detalles</span>
                                                </div>
                                            </div>
                                            <h3 className="text-white font-medium truncate group-hover:text-[#00A8E1] transition-colors">{pelicula.titulo}</h3>
                                            <div className="flex items-center gap-2 text-sm text-[#8197A4]">
                                                <span>{new Date(pelicula.fechaEstreno).getFullYear()}</span>
                                                <span>•</span>
                                                <div className="flex items-center text-[#facc15]">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                    {pelicula.valoracion}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center mt-20">
                                    <p className="text-xl text-white">No se han encontrado resultados.</p>
                                    <p className="text-[#8197A4]">Intenta ajustar los filtros.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;

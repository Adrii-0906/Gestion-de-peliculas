import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import listaService from '../services/listaService';
import { getMovieImages } from '../services/tmdb';

function MiLista() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [failedImages, setFailedImages] = useState(new Set());
    const [fallbackImages, setFallbackImages] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    // Effect to fetch from TMDB only for failed images
    useEffect(() => {
        if (failedImages.size === 0) return;

        failedImages.forEach(movieId => {
            if (fallbackImages[movieId]) return;

            const item = lista.find(i => i.pelicula.id === movieId);
            if (item) {
                const movie = item.pelicula;
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
    }, [failedImages, lista, fallbackImages]);

    useEffect(() => {
        const fetchLista = async () => {
            if (user) {
                try {
                    const data = await listaService.obtenerLista(user.id);
                    setLista(data);
                } catch (error) {
                    console.error("Error cargando mi lista", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchLista();
    }, [user]);

    const getImageUrl = (movie) => {
        if (fallbackImages[movie.id]) return fallbackImages[movie.id];
        if (movie.imagenUrl && movie.imagenUrl.startsWith('http') && !failedImages.has(movie.id)) {
            return movie.imagenUrl;
        }
        return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgMzAwIDQ1MCI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMyMDMwNDAiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMjQiPk5vIENvdmVyPC90ZXh0Pgo8L3N2Zz4=";
    };

    const handleImageError = (movie) => {
        if (!failedImages.has(movie.id)) {
            setFailedImages(prev => new Set(prev).add(movie.id));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F171E' }}>
                <div className="w-12 h-12 rounded-full animate-spin" style={{ border: '4px solid #00A8E1', borderTopColor: 'transparent' }}></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-6 lg:px-10 pb-20" style={{ backgroundColor: '#0F171E' }}>
            <h1 className="text-3xl font-bold text-white mb-8">Mi Lista</h1>

            {lista.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-400 mb-4">No tienes películas en tu lista aún.</p>
                    <Link to="/home" className="inline-block px-6 py-3 rounded font-medium transition-colors" style={{ backgroundColor: '#00A8E1', color: 'white' }}>
                        Explorar películas
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {lista.map((item) => {
                        const movie = item.pelicula;
                        return (
                            <Link
                                key={item.id}
                                to={`/peliculas/${movie.id}`}
                                className="relative group block rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
                                style={{ aspectRatio: '2/3', backgroundColor: '#1A242F', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}
                            >
                                <img
                                    src={getImageUrl(movie)}
                                    alt={movie.titulo}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={() => handleImageError(movie)}
                                />

                                {/* Gradient Overlay */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }}
                                >
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-white font-medium text-sm truncate">{movie.titulo}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            {movie.valoracion && (
                                                <span className="text-xs text-yellow-400 flex items-center gap-0.5">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                    {movie.valoracion}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(0, 168, 225, 0.9)' }}>
                                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MiLista;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { getMovieImages, getMovieTrailer } from '../services/tmdb';

const PeliculaDetail = () => {
    const { id } = useParams();
    const [pelicula, setPelicula] = useState(null);
    const [loading, setLoading] = useState(true);
    const [backdrop, setBackdrop] = useState('');
    const [tmdbPoster, setTmdbPoster] = useState('');
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState(null);
    const [loadingTrailer, setLoadingTrailer] = useState(false);

    useEffect(() => {
        api.get(`/peliculas/${id}`)
            .then(res => {
                setPelicula(res.data);
                // Fetch TMDB images
                getMovieImages(res.data.titulo).then(tmdbData => {
                    if (tmdbData) {
                        if (tmdbData.backdrop) setBackdrop(tmdbData.backdrop);
                        if (tmdbData.poster) setTmdbPoster(tmdbData.poster);
                    }
                });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handlePlayTrailer = async () => {
        if (!pelicula) return;
        setLoadingTrailer(true);
        try {
            const trailer = await getMovieTrailer(pelicula.titulo);
            if (trailer) {
                setTrailerUrl(trailer.url);
                setShowTrailer(true);
            } else {
                alert('No se encontró trailer para esta película');
            }
        } catch (err) {
            console.error(err);
            alert('Error al cargar el trailer');
        } finally {
            setLoadingTrailer(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F171E' }}>
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="w-16 h-16 rounded-full animate-spin"
                        style={{ border: '4px solid #00A8E1', borderTopColor: 'transparent' }}
                    ></div>
                    <p className="text-lg" style={{ color: '#8197A4' }}>Cargando película...</p>
                </div>
            </div>
        );
    }

    if (!pelicula) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F171E' }}>
                <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <h2 className="text-2xl text-white mb-4">Película no encontrada</h2>
                    <Link
                        to="/home"
                        className="px-6 py-3 rounded-lg font-medium"
                        style={{ backgroundColor: '#00A8E1', color: 'white' }}
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    const posterUrl = tmdbPoster || pelicula.imagenUrl || 'https://via.placeholder.com/300x450?text=Sin+Imagen';
    const year = pelicula.fechaEstreno ? new Date(pelicula.fechaEstreno).getFullYear() : 'N/A';

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0F171E' }}>

            {/* Cinematic Hero Section */}
            <div className="relative" style={{ height: '85vh', minHeight: '600px' }}>
                {/* Background Backdrop */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: backdrop ? `url(${backdrop})` : 'none',
                        backgroundColor: backdrop ? 'transparent' : '#1A242F',
                        filter: 'blur(2px) brightness(0.4)',
                        transform: 'scale(1.02)'
                    }}
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to right, rgba(15, 23, 30, 0.98) 0%, rgba(15, 23, 30, 0.7) 40%, rgba(15, 23, 30, 0.4) 100%)'
                }} />
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to top, #0F171E 0%, transparent 40%, transparent 100%)'
                }} />

                {/* Content Container */}
                <div className="relative z-10 h-full flex items-center">
                    <div className="w-full max-w-7xl mx-auto px-6 lg:px-10">

                        {/* Back Button */}
                        <Link
                            to="/home"
                            className="absolute top-24 left-6 lg:left-10 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200"
                            style={{ backgroundColor: 'rgba(26, 36, 47, 0.8)', color: '#FFFFFF', border: '1px solid #425265' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 168, 225, 0.3)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(26, 36, 47, 0.8)'}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver
                        </Link>

                        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start pt-20">

                            {/* Poster */}
                            <div className="flex-shrink-0">
                                <div
                                    className="relative rounded-xl overflow-hidden shadow-2xl"
                                    style={{
                                        width: '280px',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 60px rgba(0, 168, 225, 0.15)'
                                    }}
                                >
                                    <img
                                        src={posterUrl}
                                        alt={pelicula.titulo}
                                        className="w-full aspect-[2/3] object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/280x420?text=Sin+Imagen';
                                        }}
                                    />
                                    {/* CineStream badge on poster */}
                                    <div
                                        className="absolute top-4 left-4 px-3 py-1 rounded-md text-sm font-bold"
                                        style={{ backgroundColor: '#00A8E1', color: 'white' }}
                                    >
                                        CS
                                    </div>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 text-center lg:text-left max-w-2xl">

                                {/* CineStream Logo */}
                                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                                    <span className="text-xl font-bold" style={{ color: '#00A8E1' }}>CineStream</span>
                                    <span className="text-sm px-2 py-0.5 rounded" style={{ backgroundColor: '#00A8E1', color: 'white' }}>
                                        Incluido
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                    {pelicula.titulo}
                                </h1>

                                {/* Metadata Row */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6" style={{ color: '#8197A4' }}>
                                    {/* Rating */}
                                    {pelicula.valoracion && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 px-3 py-1 rounded-lg" style={{ backgroundColor: 'rgba(250, 204, 21, 0.15)' }}>
                                                <svg className="w-5 h-5" style={{ color: '#facc15' }} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="font-bold" style={{ color: '#facc15' }}>{pelicula.valoracion}/10</span>
                                            </div>
                                        </div>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {year}
                                    </span>
                                    {pelicula.duracion && (
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {Math.floor(pelicula.duracion / 60)}h {pelicula.duracion % 60}min
                                        </span>
                                    )}
                                    <span className="px-3 py-1 rounded text-xs font-semibold" style={{ border: '1px solid #425265' }}>
                                        HD
                                    </span>
                                    <span className="px-3 py-1 rounded text-xs font-semibold" style={{ border: '1px solid #425265' }}>
                                        5.1
                                    </span>
                                </div>

                                {/* Categories */}
                                {pelicula.categorias && pelicula.categorias.length > 0 && (
                                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                                        {pelicula.categorias.map(cat => (
                                            <span
                                                key={cat.id}
                                                className="px-4 py-1.5 rounded-full text-sm font-medium"
                                                style={{ backgroundColor: 'rgba(0, 168, 225, 0.15)', color: '#00A8E1', border: '1px solid rgba(0, 168, 225, 0.3)' }}
                                            >
                                                {cat.nombre}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Synopsis */}
                                <p className="text-lg leading-relaxed mb-8" style={{ color: '#d1d5db' }}>
                                    {pelicula.sinopsis || 'Sin sinopsis disponible'}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                                    <button
                                        onClick={handlePlayTrailer}
                                        disabled={loadingTrailer}
                                        className="flex items-center gap-3 px-10 py-4 font-bold rounded-lg text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                                        style={{ backgroundColor: '#FFFFFF', color: '#0F171E' }}
                                    >
                                        {loadingTrailer ? (
                                            <div className="w-6 h-6 rounded-full animate-spin" style={{ border: '3px solid #0F171E', borderTopColor: 'transparent' }}></div>
                                        ) : (
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                            </svg>
                                        )}
                                        {loadingTrailer ? 'Cargando...' : 'Ver Trailer'}
                                    </button>
                                    <button
                                        className="flex items-center gap-3 px-8 py-4 font-semibold rounded-lg transition-all duration-200"
                                        style={{ backgroundColor: 'rgba(26, 36, 47, 0.8)', color: '#FFFFFF', border: '1px solid #425265' }}
                                        onMouseOver={(e) => e.currentTarget.style.borderColor = '#00A8E1'}
                                        onMouseOut={(e) => e.currentTarget.style.borderColor = '#425265'}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Mi lista
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-6 py-4 font-semibold rounded-lg transition-all duration-200"
                                        style={{ backgroundColor: 'transparent', color: '#8197A4' }}
                                        onMouseOver={(e) => e.currentTarget.style.color = '#FFFFFF'}
                                        onMouseOut={(e) => e.currentTarget.style.color = '#8197A4'}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                        Compartir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info Section */}
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-12" style={{ marginTop: '-100px', position: 'relative', zIndex: 20 }}>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Director Card */}
                    {pelicula.director && (
                        <div
                            className="rounded-xl p-6"
                            style={{ backgroundColor: '#1A242F', border: '1px solid #425265' }}
                        >
                            <h3 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: '#8197A4' }}>
                                Director
                            </h3>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                                    style={{ backgroundColor: '#2A3847', color: '#00A8E1' }}
                                >
                                    {pelicula.director.nombre?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xl font-semibold text-white">{pelicula.director.nombre}</p>
                                    <p className="text-sm" style={{ color: '#8197A4' }}>Director</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cast Card */}
                    <div
                        className="rounded-xl p-6 lg:col-span-2"
                        style={{ backgroundColor: '#1A242F', border: '1px solid #425265' }}
                    >
                        <h3 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: '#8197A4' }}>
                            Reparto Principal
                        </h3>
                        {pelicula.actores && pelicula.actores.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {pelicula.actores.slice(0, 8).map((actor, idx) => (
                                    <div key={actor.id || idx} className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                                            style={{
                                                backgroundColor: `hsl(${(idx * 40) + 180}, 50%, 30%)`,
                                                color: '#FFFFFF'
                                            }}
                                        >
                                            {actor.nombre?.charAt(0)}
                                        </div>
                                        <p className="text-white text-sm font-medium truncate">{actor.nombre}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#8197A4' }}>No hay información del reparto disponible</p>
                        )}
                    </div>
                </div>

                {/* Technical Details */}
                <div
                    className="rounded-xl p-6 mt-8"
                    style={{ backgroundColor: '#1A242F', border: '1px solid #425265' }}
                >
                    <h3 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: '#8197A4' }}>
                        Detalles
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm mb-1" style={{ color: '#8197A4' }}>Año</p>
                            <p className="text-white font-medium">{year}</p>
                        </div>
                        <div>
                            <p className="text-sm mb-1" style={{ color: '#8197A4' }}>Duración</p>
                            <p className="text-white font-medium">
                                {pelicula.duracion ? `${Math.floor(pelicula.duracion / 60)}h ${pelicula.duracion % 60}min` : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm mb-1" style={{ color: '#8197A4' }}>Calidad</p>
                            <p className="text-white font-medium">HD 1080p</p>
                        </div>
                        <div>
                            <p className="text-sm mb-1" style={{ color: '#8197A4' }}>Audio</p>
                            <p className="text-white font-medium">Español, Inglés</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Padding */}
            <div style={{ height: '60px' }}></div>

            {/* Trailer Modal */}
            {showTrailer && trailerUrl && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => {
                            setShowTrailer(false);
                            setTrailerUrl(null);
                        }}
                        className="absolute top-6 right-6 p-3 rounded-full transition-all duration-200 hover:scale-110"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* YouTube iFrame */}
                    <div className="w-full max-w-5xl px-4">
                        <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                            <iframe
                                src={trailerUrl}
                                title="Trailer"
                                className="absolute top-0 left-0 w-full h-full rounded-xl"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ border: 'none' }}
                            ></iframe>
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-xl font-semibold text-white">{pelicula.titulo}</p>
                            <p className="text-sm" style={{ color: '#8197A4' }}>Trailer Oficial</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeliculaDetail;
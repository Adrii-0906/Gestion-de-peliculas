import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import listaService from '../services/listaService'; // Importar servicio
import { getMovieImages, getMovieTrailer } from '../services/tmdb';
import CommentSection from '../components/CommentSection'; // Import

const PeliculaDetail = () => {
    const { id } = useParams();
    const [pelicula, setPelicula] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tmdbBackdrop, setTmdbBackdrop] = useState(null);
    const [tmdbPoster, setTmdbPoster] = useState('');
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState(null);
    const [loadingTrailer, setLoadingTrailer] = useState(false);
    const [enLista, setEnLista] = useState(false); // Estado para lista
    const [showShareModal, setShowShareModal] = useState(false); // Estado para modal de compartir
    const user = JSON.parse(localStorage.getItem('user')); // Usuario actual

    useEffect(() => {
        const fetchPelicula = async () => {
            try {
                const response = await api.get(`/peliculas/${id}`);
                setPelicula(response.data);

                // Fetch TMDB images
                getMovieImages(response.data.titulo).then(data => {
                    if (data) {
                        if (data.backdrop) setTmdbBackdrop(data.backdrop);
                        if (data.poster) setTmdbPoster(data.poster);
                    }
                });

                // Verificar si está en mi lista
                if (user) {
                    const status = await listaService.verificarEstado(user.id, id);
                    setEnLista(status);
                }

            } catch (error) {
                console.error('Error fetching pelicula:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPelicula();
    }, [id, user]);

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

    const toggleLista = async () => {
        if (!user || !pelicula) return;

        try {
            if (enLista) {
                await listaService.quitar(user.id, pelicula.id);
                setEnLista(false);
            } else {
                await listaService.agregar(user.id, pelicula.id);
                setEnLista(true);
            }
        } catch (error) {
            console.error("Error al modificar lista", error);
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

    const posterUrl = tmdbPoster || pelicula.imagenUrl || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgMzAwIDQ1MCI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMyMDMwNDAiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMjQiPk5vIENvdmVyPC90ZXh0Pgo8L3N2Zz4=";
    const year = pelicula.fechaEstreno ? new Date(pelicula.fechaEstreno).getFullYear() : 'N/A';

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0F171E' }}>

            {/* Cinematic Hero Section */}
            <div className="relative" style={{ height: '85vh', minHeight: '600px' }}>
                {/* Background Backdrop */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: tmdbBackdrop ? `url(${tmdbBackdrop})` : 'none',
                        backgroundColor: tmdbBackdrop ? 'transparent' : '#1A242F',
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
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgMzAwIDQ1MCI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMyMDMwNDAiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMjQiPk5vIENvdmVyPC90ZXh0Pgo8L3N2Zz4=";
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
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {Math.floor(pelicula.duracion / 60)}h {pelicula.duracion % 60}min
                                        </span>
                                    )}
                                    {/* Age Classification Badge */}
                                    {(() => {
                                        const edad = pelicula.edadMinima ?? 12;
                                        const styles = {
                                            0: { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', label: 'TP' },
                                            7: { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', label: '+7' },
                                            12: { bg: 'rgba(234, 179, 8, 0.2)', color: '#eab308', label: '+12' },
                                            16: { bg: 'rgba(249, 115, 22, 0.2)', color: '#f97316', label: '+16' },
                                            18: { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', label: '+18' }
                                        };
                                        const s = styles[edad] || styles[12];
                                        return (
                                            <span
                                                className="px-3 py-1 rounded-lg font-bold text-sm"
                                                style={{ backgroundColor: s.bg, color: s.color }}
                                            >
                                                {s.label}
                                            </span>
                                        );
                                    })()}
                                    <button
                                        onClick={toggleLista}
                                        className="px-8 py-3 rounded font-bold text-white transition-all duration-300 transform hover:scale-105 flex items-center"
                                        style={{
                                            backgroundColor: enLista ? 'rgba(255, 255, 255, 0.2)' : 'rgba(100, 116, 139, 0.5)',
                                            backdropFilter: 'blur(5px)'
                                        }}
                                    >
                                        {enLista ? (
                                            <>
                                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                En Mi Lista
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                                Mi Lista
                                            </>
                                        )}
                                    </button>
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
                                        onClick={() => setShowShareModal(true)}
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
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-12" style={{ marginTop: '0px', position: 'relative', zIndex: 20 }}>

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
                            <p className="text-white font-medium">
                                {pelicula.idiomas && pelicula.idiomas.length > 0
                                    ? pelicula.idiomas.map(i => i.nombre).join(', ')
                                    : 'Español, Inglés'}
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm mb-1" style={{ color: '#8197A4' }}>Disponible en</p>
                            <div className="flex flex-wrap gap-3">
                                {pelicula.plataformas && pelicula.plataformas.length > 0 ? (
                                    pelicula.plataformas.map(plat => (
                                        <a
                                            key={plat.id}
                                            href={plat.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1 rounded bg-[#2A3847] text-white hover:bg-[#00A8E1] transition-colors text-sm font-medium"
                                        >
                                            {plat.nombre}
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-white font-medium">No disponible</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <CommentSection peliculaId={pelicula.id} />

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

            {/* Share Modal */}
            {showShareModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
                    onClick={() => setShowShareModal(false)}
                >
                    <div
                        className="rounded-xl p-6 max-w-md w-full mx-4"
                        style={{ backgroundColor: '#1A242F', border: '1px solid #425265' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Compartir "{pelicula.titulo}"</h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {/* Twitter/X */}
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`¡Mira ${pelicula.titulo} en CineStream!`)}&url=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 p-4 rounded-lg transition-all hover:scale-105"
                                style={{ backgroundColor: '#000000', color: 'white' }}
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                <span className="font-semibold">X</span>
                            </a>

                            {/* WhatsApp */}
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(`¡Mira ${pelicula.titulo} en CineStream! ${window.location.href}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 p-4 rounded-lg transition-all hover:scale-105"
                                style={{ backgroundColor: '#25D366', color: 'white' }}
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span className="font-semibold">WhatsApp</span>
                            </a>

                            {/* Facebook */}
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 p-4 rounded-lg transition-all hover:scale-105"
                                style={{ backgroundColor: '#1877F2', color: 'white' }}
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span className="font-semibold">Facebook</span>
                            </a>

                            {/* Copiar enlace */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('¡Enlace copiado al portapapeles!');
                                }}
                                className="flex items-center justify-center gap-3 p-4 rounded-lg transition-all hover:scale-105"
                                style={{ backgroundColor: '#00A8E1', color: 'white' }}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span className="font-semibold">Copiar</span>
                            </button>
                        </div>

                        <p className="text-center text-sm" style={{ color: '#8197A4' }}>
                            Comparte esta película con tus amigos
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeliculaDetail;
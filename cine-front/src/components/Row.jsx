import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMovieImages } from '../services/tmdb';

const Row = ({ titulo, peliculas, isTop10 = false }) => {
    const rowRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [failedImages, setFailedImages] = useState(new Set());
    const [fallbackImages, setFallbackImages] = useState({});

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

    const scroll = (direction) => {
        if (rowRef.current) {
            const scrollAmount = rowRef.current.clientWidth * 0.8;
            const newScrollLeft = rowRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            rowRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        if (rowRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    if (!peliculas || peliculas.length === 0) return null;

    const getImageUrl = (movie) => {
        // 1. Try fallback (TMDB) first if available
        if (fallbackImages[movie.id]) return fallbackImages[movie.id];

        // 2. Try backend URL
        if (movie.imagenUrl && movie.imagenUrl.startsWith('http') && !failedImages.has(movie.id)) {
            return movie.imagenUrl;
        }

        // 3. Last resort placeholder
        return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMjAwIDMwMCI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMzMzMiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMTYiPk5vIENvdmVyPC90ZXh0Pgo8L3N2Zz4=";
    };

    const handleImageError = (movie) => {
        if (!failedImages.has(movie.id)) {
            setFailedImages(prev => new Set(prev).add(movie.id));
        }
    };

    return (
        <div className="relative group py-4">
            {/* Row Title */}
            <div className="px-6 lg:px-10 mb-3">
                <h2 className="text-lg lg:text-xl font-semibold text-white flex items-center gap-2">
                    {titulo}
                </h2>
            </div>

            {/* Arrows */}
            {!isTop10 && showLeftArrow && (
                <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ height: 'calc(100% - 60px)', width: '60px', background: 'linear-gradient(to right, rgba(15, 23, 30, 0.95), transparent)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: 'rgba(0, 168, 225, 0.8)' }}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </div>
                </button>
            )}
            {!isTop10 && showRightArrow && (
                <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ height: 'calc(100% - 60px)', width: '60px', background: 'linear-gradient(to left, rgba(15, 23, 30, 0.95), transparent)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: 'rgba(0, 168, 225, 0.8)' }}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                </button>
            )}

            {/* Movies Row */}
            <div
                ref={rowRef}
                onScroll={handleScroll}
                className="flex gap-3 overflow-x-auto px-6 lg:px-10 scrollbar-hide pb-2"
                style={{ scrollBehavior: 'smooth', scrollSnapType: isTop10 ? 'x mandatory' : 'none' }}
            >
                {peliculas.map((movie, index) => (
                    <Link
                        key={movie.id}
                        to={`/peliculas/${movie.id}`}
                        className={`flex-shrink-0 group/card relative ${isTop10 ? 'flex items-end gap-1 group/item' : ''}`}
                        style={isTop10 ? { scrollSnapAlign: 'start' } : {}}
                    >
                        {isTop10 && (
                            <div className="relative" style={{ fontSize: index === 9 ? '5rem' : '6rem', fontWeight: '800', lineHeight: '0.8', WebkitTextStroke: '2px #425265', color: 'transparent', marginRight: index === 9 ? '-15px' : '-10px', zIndex: 1 }}>
                                {index + 1}
                            </div>
                        )}

                        <div
                            className="relative rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:z-10"
                            style={{
                                width: isTop10 ? '120px' : '180px',
                                height: isTop10 ? '180px' : '270px',
                                backgroundColor: '#1A242F',
                                boxShadow: isTop10 ? '0 4px 20px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.3)'
                            }}
                        >
                            <img
                                src={getImageUrl(movie)}
                                alt={movie.titulo}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={() => handleImageError(movie)}
                            />
                            {/* ... Rest of overlay logic ... */}

                            {/* Hover Overlay */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200"
                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }}
                            >
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="text-white text-sm font-medium mb-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {movie.titulo}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs" style={{ color: '#8197A4' }}>
                                        {movie.valoracion && (
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3 h-3" style={{ color: '#facc15' }} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                {movie.valoracion}/10
                                            </span>
                                        )}
                                        {movie.duracion && <span>{movie.duracion}min</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Play Icon on Hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 pointer-events-none">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 168, 225, 0.9)' }}>
                                    <svg className="w-6 h-6 ml-1 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                    </svg>
                                </div>
                            </div>

                            {/* CineStream Badge */}
                            {index < 3 && (
                                <div
                                    className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold text-white"
                                    style={{ backgroundColor: '#00A8E1' }}
                                >
                                    CS
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
                {/* Extra padding at end */}
                <div className="flex-shrink-0 w-6"></div>
            </div>
        </div>
    );
}

export default Row;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMovieImages } from '../services/tmdb';

function HeroCarousel({ peliculas }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [backdrop, setBackdrop] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (peliculas.length === 0) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % peliculas.length);
                setIsTransitioning(false);
            }, 500);
        }, 8000);

        return () => clearInterval(interval);
    }, [peliculas.length]);

    useEffect(() => {
        if (peliculas.length === 0) return;
        const peliculaActual = peliculas[currentIndex];

        getMovieImages(peliculaActual.titulo).then(data => {
            if (data && data.backdrop) {
                setBackdrop(data.backdrop);
            }
        });
    }, [currentIndex, peliculas]);

    if (peliculas.length === 0) return null;

    const peliActual = peliculas[currentIndex];

    return (
        <div className="relative w-full overflow-hidden" style={{ height: '80vh' }}>
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
                style={{
                    backgroundImage: `url(${backdrop})`,
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning ? 'scale(1.05)' : 'scale(1)'
                }}
            />

            {/* Gradient Overlays */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to right, #0F171E 0%, rgba(15, 23, 30, 0.7) 50%, transparent 100%)'
                }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to top, #0F171E 0%, transparent 50%, rgba(15, 23, 30, 0.3) 100%)'
                }}
            />

            {/* Content */}
            <div
                className="relative z-10 h-full flex flex-col justify-end pb-16 lg:pb-24 px-6 lg:px-10 max-w-3xl transition-all duration-500"
                style={{
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning ? 'translateY(16px)' : 'translateY(0)'
                }}
            >
                {/* CineStream Badge */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-sm tracking-wider" style={{ color: '#00A8E1' }}>CineStream</span>
                    <span className="text-xs" style={{ color: '#8197A4' }}>Incluido</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {peliActual.titulo}
                </h1>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm mb-4" style={{ color: '#8197A4' }}>
                    {peliActual.valoracion && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" style={{ color: '#facc15' }} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {peliActual.valoracion}/10
                        </span>
                    )}
                    {peliActual.duracion && <span>{peliActual.duracion} min</span>}
                    {peliActual.fechaEstreno && <span>{new Date(peliActual.fechaEstreno).getFullYear()}</span>}
                </div>

                {/* Synopsis */}
                <p className="text-base lg:text-lg mb-6 leading-relaxed" style={{ color: '#d1d5db', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {peliActual.sinopsis}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <Link
                        to={`/peliculas/${peliActual.id}`}
                        className="flex items-center gap-2 px-8 py-3 font-semibold rounded transition-all duration-200"
                        style={{ backgroundColor: '#FFFFFF', color: '#0F171E' }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#FFFFFF'}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Reproducir
                    </Link>
                    <button
                        className="flex items-center gap-2 px-6 py-3 font-semibold rounded transition-all duration-200"
                        style={{ backgroundColor: 'rgba(26, 36, 47, 0.8)', color: '#FFFFFF', border: '1px solid #425265' }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2A3847'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(26, 36, 47, 0.8)'}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Mi lista
                    </button>
                    <Link
                        to={`/peliculas/${peliActual.id}`}
                        className="flex items-center gap-2 px-6 py-3 font-medium transition-colors"
                        style={{ color: '#FFFFFF' }}
                        onMouseOver={(e) => e.target.style.color = '#00A8E1'}
                        onMouseOut={(e) => e.target.style.color = '#FFFFFF'}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Detalles
                    </Link>
                </div>
            </div>


        </div>
    );
}

export default HeroCarousel;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMovieImages } from '../services/tmdb'; // Necesitamos esto para los fondos HD

function HeroCarousel({ peliculas }) {
    // Índice de la película actual en el carrusel
    const [currentIndex, setCurrentIndex] = useState(0);
    // Estado para guardar la imagen de fondo HD actual
    const [backdrop, setBackdrop] = useState('');

    // 1. Lógica del temporizador (Auto-play)
    useEffect(() => {
        if (peliculas.length === 0) return;

        // Cambia de diapositiva cada 6 segundos
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % peliculas.length);
        }, 6000);

        // Limpieza: borra el temporizador si el componente se desmonta
        return () => clearInterval(interval);
    }, [peliculas.length]);

    // 2. Lógica para cargar el fondo HD cuando cambia el índice
    useEffect(() => {
        if (peliculas.length === 0) return;
        const peliculaActual = peliculas[currentIndex];

        // Pedimos a TMDB el fondo gigante basado en el título
        getMovieImages(peliculaActual.titulo).then(data => {
            if (data && data.backdrop) {
                setBackdrop(data.backdrop);
            }
        });
    }, [currentIndex, peliculas]);


    if (peliculas.length === 0) return null;

    const peliActual = peliculas[currentIndex];

    // Estilo del contenedor gigante
    const heroStyle = {
        backgroundImage: `linear-gradient(to top, #141414 10%, transparent 90%), linear-gradient(to right, #141414 30%, transparent 70%), url(${backdrop})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        height: '85vh', // Altura casi completa de la pantalla
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '5%',
        position: 'relative',
        transition: 'background-image 0.5s ease-in-out' // Suaviza el cambio de imagen
    };

    return (
        <div style={heroStyle}>
            <div style={{ maxWidth: '600px', zIndex: 2 }}>
                <h1 style={{ fontSize: '4rem', textShadow: '2px 2px 4px black', marginBottom: '20px' }}>
                    {peliActual.titulo}
                </h1>

                <p style={{ fontSize: '1.2rem', textShadow: '1px 1px 2px black', marginBottom: '30px' }}>
                    {peliActual.sinopsis}
                </p>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <Link to={`/pelicula/${peliActual.id}`} style={{
                        padding: '15px 30px',
                        backgroundColor: '#e50914', color: 'white',
                        textDecoration: 'none', borderRadius: '5px',
                        fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center'
                    }}>
                        ▶ Reproducir
                    </Link>
                    <Link to={`/pelicula/${peliActual.id}`} style={{
                        padding: '15px 30px',
                        backgroundColor: 'rgba(109, 109, 110, 0.7)', color: 'white',
                        textDecoration: 'none', borderRadius: '5px',
                        fontSize: '1.2rem', fontWeight: 'bold'
                    }}>
                        ℹ Más Información
                    </Link>
                </div>
            </div>

            {/* Indicadores (puntitos abajo) opcionales */}
            <div style={{ position: 'absolute', bottom: '20px', right: '40px', display: 'flex', gap: '10px' }}>
                {peliculas.map((_, idx) => (
                    <div key={idx} style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        backgroundColor: idx === currentIndex ? 'white' : 'gray',
                        cursor: 'pointer', transition: '0.3s'
                    }} onClick={() => setCurrentIndex(idx)} />
                ))}
            </div>
        </div>
    );
}

export default HeroCarousel;
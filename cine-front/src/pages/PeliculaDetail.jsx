import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';      // Tu Backend
import { getMovieImages } from '../services/tmdb'; // API Externa

function PeliculaDetail() {
  const { id } = useParams();
  const [peli, setPeli] = useState(null);
  const [tmdbData, setTmdbData] = useState(null);

  useEffect(() => {
    // 1. Cargamos datos de TU base de datos (Directores, Actores...)
    api.get(`/peliculas/${id}`).then(async (res) => {
        const datosBackend = res.data;
        setPeli(datosBackend);

        // 2. Usamos el título para buscar el fondo gigante en TMDB
        const imagenes = await getMovieImages(datosBackend.titulo);
        setTmdbData(imagenes);
    });
  }, [id]);

  if (!peli) return <div style={{color:'white', padding:'20px'}}>Cargando...</div>;

  // Estilo para el fondo tipo Netflix
  const headerStyle = {
    backgroundImage: `linear-gradient(to top, #141414, transparent), url(${tmdbData?.backdrop || ''})`,
    backgroundSize: 'cover',
    backgroundPosition: 'top center',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '40px'
  };

  return (
    <div>
        <Link to="/" style={{ position:'absolute', top:'20px', left:'20px', color:'white', textDecoration:'none', zIndex:10, background:'rgba(0,0,0,0.5)', padding:'5px 10px', borderRadius:'5px' }}>⬅ Volver</Link>

        {/* HERO SECTION CON FONDO */}
        <div style={headerStyle}>
            <div style={{ maxWidth: '800px', textShadow: '2px 2px 4px black' }}>
                <h1 style={{ fontSize: '4rem', margin: 0 }}>{peli.titulo}</h1>
                <div style={{ display:'flex', gap:'15px', margin:'10px 0', fontSize:'1.2rem', fontWeight:'bold' }}>
                    <span style={{color: '#46d369'}}>Puntuación: {peli.valoracion}/5</span>
                    <span>{peli.fechaEstreno}</span>
                    <span>{peli.duracion} min</span>
                </div>
                <p style={{ fontSize: '1.3rem', lineHeight: '1.5' }}>{peli.sinopsis}</p>
            </div>
        </div>

        {/* DETALLES TÉCNICOS (Tu Base de Datos) */}
        <div style={{ padding: '40px', background: '#141414' }}>
            <h2>Detalles de Producción</h2>

            <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>

                {/* Director */}
                <div>
                    <h3 style={{ color: '#777' }}>Director</h3>
                    <p style={{ fontSize: '1.2rem' }}>
                        {peli.director ? peli.director.nombre : 'No especificado'}
                    </p>
                </div>

                {/* Actores */}
                <div>
                    <h3 style={{ color: '#777' }}>Reparto Principal</h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {peli.actores && peli.actores.length > 0 ? (
                            peli.actores.map(actor => (
                                <span key={actor.id} style={{ background: '#333', padding: '5px 15px', borderRadius: '20px' }}>
                                    {actor.nombre}
                                </span>
                            ))
                        ) : (
                            <p>No hay actores registrados.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
}

export default PeliculaDetail;
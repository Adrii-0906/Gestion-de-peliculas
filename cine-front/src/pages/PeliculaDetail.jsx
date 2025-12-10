import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const PeliculaDetail = () => {
    const { id } = useParams();
    const [pelicula, setPeliculas] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar datos
        axios.get(`http://localhost:8081/api/peliculas/${id}`)
            .then(res => {
                setPeliculas(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    // --- ESTILOS VISUALES (CSS-in-JS) ---
    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#141414', // Fondo Netflix
            color: 'white',
            paddingTop: '90px', // Para que no lo tape el Navbar
            paddingBottom: '50px',
            fontFamily: 'Arial, sans-serif'
        },
        contentWrapper: {
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            flexWrap: 'wrap', // Para móviles
            gap: '40px'
        },
        // Columna Izquierda: Póster
        posterColumn: {
            flex: '0 0 300px', // Ancho fijo de 300px
            maxWidth: '100%'
        },
        posterImage: {
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 0 20px rgba(0,0,0,0.8)', // Sombra elegante
            border: '1px solid #333'
        },
        // Columna Derecha: Info
        infoColumn: {
            flex: '1', // Ocupa el resto del espacio
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        },
        title: {
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '10px',
            lineHeight: '1.1'
        },
        metaData: {
            display: 'flex',
            gap: '15px',
            marginBottom: '20px',
            fontSize: '1.1rem',
            color: '#bcbcbc'
        },
        badge: {
            border: '1px solid #bcbcbc',
            padding: '2px 8px',
            borderRadius: '3px',
            fontSize: '0.8rem'
        },
        synopsisTitle: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginTop: '20px',
            marginBottom: '10px',
            color: 'white'
        },
        synopsis: {
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: '#dcdcdc',
            maxWidth: '700px'
        },
        castSection: {
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid #333'
        },
        btnBack: {
            display: 'inline-block',
            marginBottom: '20px',
            color: '#bcbcbc',
            textDecoration: 'none',
            fontSize: '1.2rem'
        }
    };

    if (loading) return <div style={{...styles.container, textAlign: 'center'}}><h2>Cargando...</h2></div>;
    if (!pelicula) return <div style={{...styles.container, textAlign: 'center'}}><h2>Película no encontrada</h2></div>;

    // URL de imagen segura (por si viene vacía)
    const imagenSegura = pelicula.imagenUrl && pelicula.imagenUrl.startsWith('http')
        ? pelicula.imagenUrl
        : "https://via.placeholder.com/300x450?text=Sin+Imagen";

    return (
        <div style={styles.container}>
            <div style={styles.contentWrapper}>

                {/* Botón Volver */}
                <div style={{ width: '100%' }}>
                    <Link to="/" style={styles.btnBack}>← Volver al inicio</Link>
                </div>

                {/* --- IZQUIERDA: PÓSTER --- */}
                <div style={styles.posterColumn}>
                    <img
                        src={imagenSegura}
                        alt={pelicula.titulo}
                        style={styles.posterImage}
                        onError={(e) => {e.target.src="https://via.placeholder.com/300x450?text=Error"}}
                    />
                </div>

                {/* --- DERECHA: INFORMACIÓN --- */}
                <div style={styles.infoColumn}>
                    <h1 style={styles.title}>{pelicula.titulo}</h1>

                    <div style={styles.metaData}>
                        <span style={{color: '#46d369', fontWeight: 'bold'}}>
                            {pelicula.valoracion * 10}% Coincidencia
                        </span>
                        <span>{pelicula.fechaEstreno ? pelicula.fechaEstreno.substring(0,4) : 'Año desc.'}</span>
                        <span style={styles.badge}>HD</span>
                        <span>{pelicula.duracion} min</span>
                    </div>

                    <h3 style={styles.synopsisTitle}>Sinopsis</h3>
                    <p style={styles.synopsis}>{pelicula.sinopsis}</p>

                    <div style={styles.castSection}>
                        <p>
                            <span style={{color: '#777'}}>Director: </span>
                            {pelicula.director?.nombre || "No especificado"}
                        </p>
                        <p>
                            <span style={{color: '#777'}}>Reparto: </span>
                            {pelicula.actores && pelicula.actores.length > 0
                                ? pelicula.actores.map(a => a.nombre).join(", ")
                                : "No registrados"}
                        </p>
                    </div>

                    <div style={{marginTop: '30px'}}>
                         <button className="btn btn-danger btn-lg" style={{marginRight: '10px'}}>
                            ▶ Reproducir
                         </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PeliculaDetail;
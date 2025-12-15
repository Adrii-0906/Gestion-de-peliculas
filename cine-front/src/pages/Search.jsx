import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Search = () => {
    const [query, setQuery] = useState('');
    const [peliculas, setPeliculas] = useState([]);
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        api.get('/peliculas')
            .then(res => {
                setPeliculas(res.data);
                setFiltered(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const results = peliculas.filter(p =>
            p.titulo.toLowerCase().includes(query.toLowerCase())
        );
        setFiltered(results);
    }, [query, peliculas]);

    return (
        <div style={{ padding: '80px 40px', minHeight: '100vh', backgroundColor: '#0f171e' }}>
            <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Buscar por título, actor o género..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '1.2rem',
                        backgroundColor: '#1a242f',
                        border: '1px solid #2a3847',
                        color: 'white',
                        borderRadius: '4px'
                    }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {filtered.map(movie => (
                    <Link key={movie.id} to={`/peliculas/${movie.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ position: 'relative', transition: 'transform 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <img
                                src={movie.imagenUrl || "https://via.placeholder.com/200x300?text=Sin+Imagen"}
                                alt={movie.titulo}
                                style={{ width: '100%', borderRadius: '4px', aspectRatio: '2/3', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/200x300?text=No+Disponible";
                                }}
                            />
                            <h3 style={{ marginTop: '10px', fontSize: '1rem', color: 'white' }}>{movie.titulo}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            {filtered.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#8197a4' }}>
                    <h2>No se encontraron resultados para "{query}"</h2>
                </div>
            )}
        </div>
    );
};

export default Search;

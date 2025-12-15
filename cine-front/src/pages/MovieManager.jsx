import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const MovieManager = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await api.get('/peliculas');
            setMovies(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/peliculas/${id}`);
            setDeleteConfirm(null);
            fetchMovies();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredMovies = movies.filter(movie =>
        movie.titulo?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F171E' }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full animate-spin" style={{ border: '4px solid #00A8E1', borderTopColor: 'transparent' }}></div>
                    <p style={{ color: '#8197A4' }}>Cargando películas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12 px-6 lg:px-10" style={{ backgroundColor: '#0F171E' }}>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Administrar Películas</h1>
                        <p style={{ color: '#8197A4' }}>{movies.length} películas en el catálogo</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#8197A4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar película..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-3 rounded-lg text-white w-full sm:w-64 focus:outline-none transition-colors"
                                style={{ backgroundColor: '#1A242F', border: '1px solid #425265' }}
                                onFocus={(e) => e.target.style.borderColor = '#00A8E1'}
                                onBlur={(e) => e.target.style.borderColor = '#425265'}
                            />
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={() => navigate('/manage-movies/new')}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                            style={{ backgroundColor: '#00A8E1', color: 'white' }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Añadir Película
                        </button>
                    </div>
                </div>

                {/* Movies Table */}
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1A242F', border: '1px solid #425265' }}>
                    {/* Table Header */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 p-4 font-semibold text-sm uppercase tracking-wider" style={{ color: '#8197A4', borderBottom: '1px solid #425265' }}>
                        <div className="col-span-4">Película</div>
                        <div className="col-span-2">Director</div>
                        <div className="col-span-2">Año</div>
                        <div className="col-span-1">Duración</div>
                        <div className="col-span-1">Rating</div>
                        <div className="col-span-2 text-right">Acciones</div>
                    </div>

                    {/* Movies List */}
                    {filteredMovies.length === 0 ? (
                        <div className="p-12 text-center" style={{ color: '#8197A4' }}>
                            {searchQuery ? 'No se encontraron películas' : 'No hay películas en el catálogo'}
                        </div>
                    ) : (
                        filteredMovies.map((movie, idx) => (
                            <div
                                key={movie.id}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 items-center transition-colors"
                                style={{
                                    borderBottom: idx < filteredMovies.length - 1 ? '1px solid #425265' : 'none',
                                    backgroundColor: 'transparent'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 168, 225, 0.05)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                {/* Movie Info */}
                                <div className="lg:col-span-4 flex items-center gap-4">
                                    <img
                                        src={movie.imagenUrl || 'https://via.placeholder.com/60x90?text=No'}
                                        alt={movie.titulo}
                                        className="w-12 h-18 rounded object-cover flex-shrink-0"
                                        style={{ width: '60px', height: '90px' }}
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/60x90?text=No'}
                                    />
                                    <div>
                                        <Link
                                            to={`/peliculas/${movie.id}`}
                                            className="text-white font-semibold hover:underline"
                                            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                                        >
                                            {movie.titulo}
                                        </Link>
                                        <p className="text-sm mt-1" style={{ color: '#8197A4', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {movie.sinopsis?.substring(0, 60)}...
                                        </p>
                                    </div>
                                </div>

                                {/* Director */}
                                <div className="lg:col-span-2 text-sm" style={{ color: movie.director ? '#FFFFFF' : '#8197A4' }}>
                                    <span className="lg:hidden font-semibold" style={{ color: '#8197A4' }}>Director: </span>
                                    {movie.director?.nombre || 'No asignado'}
                                </div>

                                {/* Year */}
                                <div className="lg:col-span-2 text-sm text-white">
                                    <span className="lg:hidden font-semibold" style={{ color: '#8197A4' }}>Año: </span>
                                    {movie.fechaEstreno ? new Date(movie.fechaEstreno).getFullYear() : 'N/A'}
                                </div>

                                {/* Duration */}
                                <div className="lg:col-span-1 text-sm text-white">
                                    <span className="lg:hidden font-semibold" style={{ color: '#8197A4' }}>Duración: </span>
                                    {movie.duracion ? `${movie.duracion}min` : 'N/A'}
                                </div>

                                {/* Rating */}
                                <div className="lg:col-span-1">
                                    <span className="lg:hidden font-semibold" style={{ color: '#8197A4' }}>Rating: </span>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" style={{ color: '#facc15' }} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-white text-sm">{movie.valoracion || 0}/5</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="lg:col-span-2 flex justify-end gap-2">
                                    <button
                                        onClick={() => navigate(`/manage-movies/edit/${movie.id}`)}
                                        className="px-4 py-2 rounded text-sm font-medium transition-colors"
                                        style={{ backgroundColor: 'rgba(0, 168, 225, 0.2)', color: '#00A8E1' }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0, 168, 225, 0.3)'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0, 168, 225, 0.2)'}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(movie.id)}
                                        className="px-4 py-2 rounded text-sm font-medium transition-colors"
                                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
                        onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}
                    >
                        <div className="rounded-xl p-6 max-w-md w-full" style={{ backgroundColor: '#1A242F', border: '1px solid #425265' }}>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
                                    <svg className="w-8 h-8" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">¿Eliminar película?</h3>
                                <p style={{ color: '#8197A4' }}>Esta acción no se puede deshacer</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 py-3 rounded-lg font-semibold transition-colors"
                                    style={{ backgroundColor: 'transparent', border: '1px solid #425265', color: '#FFFFFF' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 py-3 rounded-lg font-semibold transition-colors"
                                    style={{ backgroundColor: '#ef4444', color: 'white' }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieManager;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { searchMovies, getFullMovieDetails } from '../services/tmdb';

const PeliculaForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    // Form state
    const [formData, setFormData] = useState({
        titulo: '',
        sinopsis: '',
        duracion: '',
        fechaEstreno: '',
        valoracion: 5,
        imagenUrl: '',
        director: null,
        actores: [],
        edadMinima: 12
    });

    // UI state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Load movie data if editing
    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            api.get(`/peliculas/${id}`)
                .then(res => {
                    const movie = res.data;
                    setFormData({
                        titulo: movie.titulo || '',
                        sinopsis: movie.sinopsis || '',
                        duracion: movie.duracion || '',
                        fechaEstreno: movie.fechaEstreno || '',
                        valoracion: movie.valoracion || 5,
                        imagenUrl: movie.imagenUrl || '',
                        director: movie.director || null,
                        actores: movie.actores || [],
                        edadMinima: movie.edadMinima ?? 12
                    });
                    setSearchQuery(movie.titulo);
                })
                .catch(err => {
                    console.error(err);
                    setError('Error al cargar la película');
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEditing]);

    // Debounced search
    useEffect(() => {
        if (!searchQuery || searchQuery.length < 2 || isEditing) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results = await searchMovies(searchQuery);
                setSearchResults(results);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery, isEditing]);

    // Select movie from TMDB
    const handleSelectMovie = async (movie) => {
        setLoading(true);
        setSelectedMovie(movie);
        setSearchResults([]);
        setSearchQuery(movie.titulo);

        try {
            const fullDetails = await getFullMovieDetails(movie.tmdbId);
            if (fullDetails) {
                setFormData({
                    titulo: fullDetails.titulo,
                    sinopsis: fullDetails.sinopsis || '',
                    duracion: fullDetails.duracion || '',
                    fechaEstreno: fullDetails.fechaEstreno || '',
                    valoracion: fullDetails.valoracion || 5,
                    imagenUrl: fullDetails.imagenUrl || '',
                    director: fullDetails.director || null,
                    actores: fullDetails.actores || [],
                    edadMinima: 12
                });
            }
        } catch (err) {
            console.error(err);
            setError('Error al obtener detalles de TMDB');
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.titulo) {
            setError('El título es obligatorio');
            return;
        }
        if (!formData.imagenUrl) {
            setError('La URL de la imagen es obligatoria');
            return;
        }
        if (!formData.sinopsis) {
            setError('La sinopsis es obligatoria');
            return;
        }

        setSaving(true);
        setError('');

        try {
            // Build payload matching PeliculaCreateUpdateDTO
            const payload = {
                titulo: formData.titulo,
                imagenUrl: formData.imagenUrl,
                duracion: parseInt(formData.duracion) || 90,
                fechaEstreno: formData.fechaEstreno || new Date().toISOString().split('T')[0],
                sinopsis: formData.sinopsis,
                valoracion: parseInt(formData.valoracion) || 5,
                edadMinima: parseInt(formData.edadMinima) || 12,
                nombreDirector: formData.director?.nombre || null,
                nombresActores: formData.actores?.map(a => a.nombre) || [],
                categoriasIds: [],
                idiomasIds: [],
                plataformasIds: []
            };

            console.log('Sending payload:', JSON.stringify(payload, null, 2));

            if (isEditing) {
                await api.put(`/peliculas/${id}`, payload);
            } else {
                await api.post('/peliculas', payload);
            }

            navigate('/manage-movies');
        } catch (err) {
            console.error('Error response:', err.response?.data);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Error al guardar la película';
            setError(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    if (loading && isEditing) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F171E' }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full animate-spin" style={{ border: '4px solid #00A8E1', borderTopColor: 'transparent' }}></div>
                    <p style={{ color: '#8197A4' }}>Cargando película...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12 px-6 lg:px-10" style={{ backgroundColor: '#0F171E' }}>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/manage-movies')}
                        className="flex items-center gap-2 mb-4 transition-colors"
                        style={{ color: '#8197A4' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#FFFFFF'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#8197A4'}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver
                    </button>
                    <h1 className="text-3xl font-bold text-white">
                        {isEditing ? 'Editar Película' : 'Añadir Película'}
                    </h1>
                    {!isEditing && (
                        <p className="mt-2" style={{ color: '#8197A4' }}>
                            Busca una película y se rellenarán automáticamente todos los detalles
                        </p>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)' }}>
                        <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span style={{ color: '#fecaca' }}>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit}>

                            {/* TMDB Search (only for new movies) */}
                            {!isEditing && (
                                <div className="mb-6 relative">
                                    <label className="block text-sm font-medium text-white mb-2">
                                        🔍 Buscar película en TMDB
                                    </label>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Escribe el nombre de la película..."
                                        className="w-full px-4 py-4 rounded-lg text-white text-lg focus:outline-none"
                                        style={{ backgroundColor: '#1A242F', border: '2px solid #00A8E1' }}
                                        autoComplete="off"
                                    />

                                    {/* Search Results Dropdown */}
                                    {searchResults.length > 0 && (
                                        <div
                                            className="absolute z-50 left-0 right-0 mt-2 rounded-lg overflow-hidden shadow-2xl"
                                            style={{ backgroundColor: '#1A242F', border: '1px solid #425265', maxHeight: '400px', overflowY: 'auto' }}
                                        >
                                            {searchResults.map((movie, idx) => (
                                                <div
                                                    key={movie.tmdbId}
                                                    onClick={() => handleSelectMovie(movie)}
                                                    className="flex items-center gap-4 p-3 cursor-pointer transition-colors"
                                                    style={{ borderBottom: idx < searchResults.length - 1 ? '1px solid #425265' : 'none' }}
                                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 168, 225, 0.1)'}
                                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    <img
                                                        src={movie.poster || 'https://via.placeholder.com/50x75?text=No'}
                                                        alt={movie.titulo}
                                                        className="w-12 h-18 rounded object-cover flex-shrink-0"
                                                        style={{ width: '50px', height: '75px' }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white font-medium truncate">{movie.titulo}</p>
                                                        <p className="text-sm" style={{ color: '#8197A4' }}>
                                                            {movie.fechaEstreno?.substring(0, 4) || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" style={{ color: '#facc15' }} fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="text-sm text-white">{movie.valoracion}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isSearching && (
                                        <div className="absolute right-4 top-10">
                                            <div className="w-5 h-5 rounded-full animate-spin" style={{ border: '2px solid #00A8E1', borderTopColor: 'transparent' }}></div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Form Fields */}
                            <div className="rounded-xl p-6" style={{ backgroundColor: '#1A242F', border: '1px solid #425265' }}>

                                {/* Title */}
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-white mb-2">Título *</label>
                                    <input
                                        type="text"
                                        value={formData.titulo}
                                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg text-white focus:outline-none"
                                        style={{ backgroundColor: '#0F171E', border: '1px solid #425265' }}
                                        required
                                    />
                                </div>

                                {/* Synopsis */}
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-white mb-2">Sinopsis</label>
                                    <textarea
                                        value={formData.sinopsis}
                                        onChange={(e) => setFormData({ ...formData, sinopsis: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg text-white focus:outline-none resize-none"
                                        style={{ backgroundColor: '#0F171E', border: '1px solid #425265' }}
                                    />
                                </div>

                                {/* Duration, Date, Rating */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Duración (min)</label>
                                        <input
                                            type="number"
                                            value={formData.duracion}
                                            onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg text-white focus:outline-none"
                                            style={{ backgroundColor: '#0F171E', border: '1px solid #425265' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Fecha de estreno</label>
                                        <input
                                            type="date"
                                            value={formData.fechaEstreno}
                                            onChange={(e) => setFormData({ ...formData, fechaEstreno: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg text-white focus:outline-none"
                                            style={{ backgroundColor: '#0F171E', border: '1px solid #425265' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Valoración</label>
                                        <select
                                            value={formData.valoracion}
                                            onChange={(e) => setFormData({ ...formData, valoracion: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg text-white focus:outline-none"
                                            style={{ backgroundColor: '#0F171E', border: '1px solid #425265' }}
                                        >
                                            {[1, 2, 3, 4, 5].map(n => (
                                                <option key={n} value={n}>{n} ⭐</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Age Classification */}
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-white mb-2">Clasificación de edad</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {[
                                            { value: 0, label: 'TP', color: '#22c55e', desc: 'Todos los públicos' },
                                            { value: 7, label: '+7', color: '#3b82f6', desc: 'Mayores de 7' },
                                            { value: 12, label: '+12', color: '#eab308', desc: 'Mayores de 12' },
                                            { value: 16, label: '+16', color: '#f97316', desc: 'Mayores de 16' },
                                            { value: 18, label: '+18', color: '#ef4444', desc: 'Solo adultos' }
                                        ].map(age => (
                                            <button
                                                key={age.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, edadMinima: age.value })}
                                                className="py-3 rounded-lg font-bold text-center transition-all"
                                                style={{
                                                    backgroundColor: formData.edadMinima === age.value ? age.color : '#0F171E',
                                                    color: formData.edadMinima === age.value ? 'white' : age.color,
                                                    border: `2px solid ${age.color}`
                                                }}
                                                title={age.desc}
                                            >
                                                {age.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Image URL */}
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-white mb-2">URL de imagen</label>
                                    <input
                                        type="url"
                                        value={formData.imagenUrl}
                                        onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg text-white focus:outline-none"
                                        style={{ backgroundColor: '#0F171E', border: '1px solid #425265' }}
                                        placeholder="https://image.tmdb.org/t/p/w500/..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={saving || !formData.titulo}
                                    className="w-full py-4 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    style={{ backgroundColor: '#00A8E1' }}
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-5 h-5 rounded-full animate-spin" style={{ border: '2px solid white', borderTopColor: 'transparent' }}></div>
                                            Guardando...
                                        </>
                                    ) : (
                                        isEditing ? 'Guardar cambios' : 'Añadir película'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Preview */}
                    <div className="lg:col-span-1">
                        <div className="rounded-xl p-6 sticky top-24" style={{ backgroundColor: '#1A242F', border: '1px solid #425265' }}>
                            <h3 className="text-lg font-semibold text-white mb-4">Vista previa</h3>

                            {/* Poster Preview */}
                            <div
                                className="rounded-lg overflow-hidden mb-4"
                                style={{ aspectRatio: '2/3', backgroundColor: '#0F171E' }}
                            >
                                {formData.imagenUrl ? (
                                    <img
                                        src={formData.imagenUrl || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgMzAwIDQ1MCI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMyMDMwNDAiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMjQiPk5vIENvdmVyPC90ZXh0Pgo8L3N2Zz4="}
                                        alt="Vista previa"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgMzAwIDQ1MCI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMyMDMwNDAiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMjQiPk5vIENvdmVyPC90ZXh0Pgo8L3N2Zz4=";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center" style={{ color: '#8197A4' }}>
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Movie Info */}
                            <h4 className="text-white font-semibold mb-2">{formData.titulo || 'Título de la película'}</h4>
                            <div className="flex items-center gap-3 mb-3 text-sm" style={{ color: '#8197A4' }}>
                                {formData.fechaEstreno && <span>{formData.fechaEstreno.substring(0, 4)}</span>}
                                {formData.duracion && <span>{formData.duracion} min</span>}
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" style={{ color: '#facc15' }} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {formData.valoracion}/5
                                </span>
                            </div>

                            {/* Director */}
                            {formData.director && (
                                <div className="mb-3">
                                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#8197A4' }}>Director</p>
                                    <p className="text-white">{formData.director.nombre}</p>
                                </div>
                            )}

                            {/* Actors */}
                            {formData.actores && formData.actores.length > 0 && (
                                <div>
                                    <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#8197A4' }}>Reparto</p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.actores.slice(0, 4).map((actor, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs px-2 py-1 rounded-full"
                                                style={{ backgroundColor: '#0F171E', color: '#00A8E1' }}
                                            >
                                                {actor.nombre}
                                            </span>
                                        ))}
                                        {formData.actores.length > 4 && (
                                            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#0F171E', color: '#8197A4' }}>
                                                +{formData.actores.length - 4} más
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeliculaForm;
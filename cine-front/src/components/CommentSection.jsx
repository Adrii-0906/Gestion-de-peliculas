import React, { useState, useEffect } from 'react';
import comentarioService from '../services/comentarioService';

const CommentSection = ({ peliculaId }) => {
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    // Verificar si el usuario es administrador
    const isAdmin = user && user.rol === 'ADMINISTRADOR';

    useEffect(() => {
        loadComentarios();
    }, [peliculaId]);

    const loadComentarios = async () => {
        try {
            const data = await comentarioService.getByPelicula(peliculaId);
            setComentarios(data);
        } catch (error) {
            console.error("Error cargando comentarios:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nuevoComentario.trim()) return;

        setSubmitting(true);
        try {
            const nuevo = await comentarioService.create(peliculaId, nuevoComentario);
            setComentarios([nuevo, ...comentarios]);
            setNuevoComentario('');
        } catch (error) {
            console.error("Error publicando comentario:", error);
            alert("No se pudo publicar el comentario. Intenta de nuevo.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este comentario?")) return;
        try {
            await comentarioService.delete(id);
            setComentarios(comentarios.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error eliminando comentario:", error);
            alert("No se pudo eliminar el comentario.");
        }
    };

    // Helper to format date relative or absolute
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="mt-12 bg-[#1A242F] rounded-xl p-6 border border-[#425265]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00A8E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                Comentarios ({comentarios.length})
            </h3>

            {/* Input Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex gap-4">
                        <img
                            src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover border border-[#425265]"
                            onError={(e) => e.target.src = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"}
                        />
                        <div className="flex-1">
                            <textarea
                                value={nuevoComentario}
                                onChange={(e) => setNuevoComentario(e.target.value)}
                                placeholder="Escribe tu opinión sobre la película..."
                                className="w-full bg-[#0F171E] text-white rounded-lg p-3 border border-[#425265] focus:border-[#00A8E1] focus:outline-none transition-colors min-h-[100px] resize-none"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={submitting || !nuevoComentario.trim()}
                                    className="px-6 py-2 bg-[#00A8E1] text-white font-medium rounded-lg hover:bg-[#0096C7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Publicando...' : 'Publicar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-[#0F171E] rounded-lg border border-[#425265] text-center">
                    <p className="text-[#8197A4]">
                        <span className="text-white font-semibold">Inicia sesión</span> para unirte a la conversación.
                    </p>
                </div>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="flex justify-center py-4">
                    <div className="w-8 h-8 rounded-full animate-spin border-4 border-[#00A8E1] border-t-transparent"></div>
                </div>
            ) : comentarios.length > 0 ? (
                <div className="space-y-6">
                    {comentarios.map(c => (
                        <div key={c.id} className="flex gap-4 group">
                            <img
                                src={c.avatar || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"}
                                alt={c.username}
                                className="w-10 h-10 rounded-full object-cover border border-[#425265] flex-shrink-0"
                                onError={(e) => e.target.src = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"}
                            />
                            <div className="flex-1">
                                <div className="flex items-baseline justify-between mb-1">
                                    <h4 className="font-semibold text-white">{c.username}</h4>
                                    <span className="text-xs text-[#8197A4]">{formatDate(c.fecha)}</span>
                                </div>
                                <div className="p-3 bg-[#0F171E] rounded-lg border border-[transparent] group-hover:border-[#425265] transition-colors">
                                    <p className="text-[#d1d5db] whitespace-pre-wrap">{c.texto}</p>
                                </div>
                                {/* Delete Button (Owner or Admin) */}
                                {user && (user.id === c.usuarioId || isAdmin) && (
                                    <button
                                        onClick={() => handleDelete(c.id)}
                                        className="text-xs text-red-400 hover:text-red-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-[#8197A4]">
                    <p>No hay comentarios aún. ¡Sé el primero en opinar!</p>
                </div>
            )}
        </div>
    );
};

export default CommentSection;

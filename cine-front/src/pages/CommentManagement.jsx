import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import comentarioService from '../services/comentarioService';

// Confirm Modal Component
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70" onClick={onCancel}></div>

            {/* Modal */}
            <div className="relative bg-[#1A242F] rounded-xl border border-gray-700 p-6 max-w-md w-full mx-4 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 mb-6">{message}</p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

const CommentManagement = () => {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, commentId: null, userName: '' });

    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        try {
            const data = await comentarioService.obtenerTodos();
            setComments(data);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const openDeleteModal = (comment) => {
        setDeleteModal({
            isOpen: true,
            commentId: comment.id,
            userName: comment.username || comment.usuarioNombre
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, commentId: null, userName: '' });
    };

    const handleConfirmDelete = async () => {
        try {
            await comentarioService.eliminar(deleteModal.commentId);
            setComments(comments.filter(c => c.id !== deleteModal.commentId));
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F171E] pt-24 px-6 lg:px-10 font-sans text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Gestión de Comentarios</h1>
                        <p className="text-gray-400">Modera las opiniones de la comunidad. Total: {comments.length} comentarios</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin')}
                        className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        Volver al Panel
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="bg-[#1A242F] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-black/30 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="p-4">Usuario</th>
                                        <th className="p-4">Película</th>
                                        <th className="p-4 w-1/2">Comentario</th>
                                        <th className="p-4">Fecha</th>
                                        <th className="p-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <tr key={comment.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold text-xs">
                                                            {(comment.username || comment.usuarioNombre)?.charAt(0)}
                                                        </div>
                                                        <span className="font-medium">{comment.username || comment.usuarioNombre}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Link to={`/peliculas/${comment.peliculaId}`} className="text-blue-400 hover:underline">
                                                        {comment.peliculaTitulo || `Película #${comment.peliculaId}`}
                                                    </Link>
                                                </td>
                                                <td className="p-4 text-gray-300">
                                                    {comment.texto}
                                                </td>
                                                <td className="p-4 text-gray-400 text-sm">
                                                    {new Date(comment.fecha).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => openDeleteModal(comment)}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-1 rounded transition-colors"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-gray-500">
                                                No hay comentarios para mostrar.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Eliminar Comentario"
                message={`¿Estás seguro de que quieres eliminar el comentario de ${deleteModal.userName}?`}
                onConfirm={handleConfirmDelete}
                onCancel={closeDeleteModal}
            />
        </div>
    );
};

export default CommentManagement;

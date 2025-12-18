import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/usuarios');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('No se pudieron cargar los usuarios. Asegúrate de tener permisos de administrador.');
            setLoading(false);
        }
    };

    const toggleUserStatus = async (user) => {
        const newStatus = !user.activo;
        try {
            // Usamos params para enviar el booleano como query param, coincidiendo con el backend @RequestParam
            await api.patch(`/usuarios/${user.id}/estado`, null, {
                params: { activo: newStatus }
            });

            // Actualizar estado localmente
            setUsers(users.map(u => u.id === user.id ? { ...u, activo: newStatus } : u));
        } catch (err) {
            console.error('Error changing user status:', err);
            alert('Error al cambiar el estado del usuario');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F171E] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F171E] pt-24 px-6 lg:px-10 font-sans text-white">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/admin')}
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
                </div>

                {error && (
                    <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="bg-[#1A242F] rounded-xl border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-900/50 text-gray-400 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">Usuario</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Rol</th>
                                    <th className="px-6 py-4 font-medium text-center">Estado</th>
                                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                                                    alt=""
                                                    className="w-10 h-10 rounded-full object-cover bg-gray-700"
                                                />
                                                <span className="font-medium text-white">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.rol === 'ADMINISTRADOR'
                                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                }`}>
                                                {user.rol}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.activo
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.rol !== 'ADMINISTRADOR' && (
                                                <button
                                                    onClick={() => toggleUserStatus(user)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1A242F] ${user.activo ? 'bg-green-500' : 'bg-gray-600'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.activo ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {users.length === 0 && !loading && !error && (
                        <div className="p-8 text-center text-gray-400">
                            No hay usuarios registrados.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;

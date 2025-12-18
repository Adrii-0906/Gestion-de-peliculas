import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../services/dashboardService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ userCount: 0, movieCount: 0, commentCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats(data);
            } catch (error) {
                console.error("Error loading stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        {
            title: 'Gestión de Películas',
            description: 'Añadir, editar o eliminar películas del catálogo.',
            icon: (
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
            ),
            path: '/admin/movies',
            bgGradient: 'from-blue-900/40 to-slate-900',
            hoverBorder: 'hover:border-blue-500/50'
        },
        {
            title: 'Gestión de Usuarios',
            description: 'Ver lista de usuarios y activar/desactivar el acceso.',
            icon: (
                <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            path: '/admin/users',
            bgGradient: 'from-purple-900/40 to-slate-900',
            hoverBorder: 'hover:border-purple-500/50'
        },
        {
            title: 'Moderación de Comentarios',
            description: 'Revisar y eliminar comentarios de la comunidad.',
            icon: (
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
            path: '/admin/comments',
            bgGradient: 'from-green-900/40 to-slate-900',
            hoverBorder: 'hover:border-green-500/50'
        }
    ];

    return (
        <div className="min-h-screen bg-[#0F171E] pt-24 px-6 lg:px-10 font-sans text-white">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
                <p className="text-gray-400 mb-10">Gestiona el contenido, usuarios y comunidad de CineStream.</p>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-[#1A242F] p-6 rounded-xl border border-gray-800 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Usuarios Totales</p>
                            <p className="text-2xl font-bold">{loading ? '...' : stats.userCount}</p>
                        </div>
                    </div>
                    <div className="bg-[#1A242F] p-6 rounded-xl border border-gray-800 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Películas</p>
                            <p className="text-2xl font-bold">{loading ? '...' : stats.movieCount}</p>
                        </div>
                    </div>
                    <div className="bg-[#1A242F] p-6 rounded-xl border border-gray-800 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Comentarios</p>
                            <p className="text-2xl font-bold">{loading ? '...' : stats.commentCount}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            onClick={() => navigate(card.path)}
                            className={`relative group p-8 rounded-xl border border-gray-800 bg-gradient-to-br ${card.bgGradient} 
                cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${card.hoverBorder}`}
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="p-4 rounded-full bg-black/30 group-hover:bg-black/50 transition-colors">
                                    {card.icon}
                                </div>
                                <h3 className="text-2xl font-semibold text-white group-hover:text-blue-200 transition-colors">
                                    {card.title}
                                </h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                    {card.description}
                                </p>
                            </div>

                            {/* Arrow indicator */}
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

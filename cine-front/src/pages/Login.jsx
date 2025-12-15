import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8081/api/usuarios/login', {
                email,
                password
            });
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/');
        } catch (err) {
            setError('Email o contraseña incorrectos');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F171E' }}>
            {/* Header */}
            <header className="p-6">
                <Link to="/home" className="inline-block">
                    <span className="text-2xl font-bold text-white">
                        Cine<span style={{ color: '#00A8E1' }}>Stream</span>
                    </span>
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 pb-20">
                <div className="w-full max-w-md">
                    {/* Login Card */}
                    <div className="rounded-lg p-8 border" style={{ backgroundColor: '#1A242F', borderColor: '#425265' }}>
                        <h1 className="text-2xl font-semibold text-white mb-6">Iniciar sesión</h1>

                        {error && (
                            <div className="mb-6 p-4 rounded flex items-start gap-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)' }}>
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f87171' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm" style={{ color: '#fecaca' }}>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2" htmlFor="email">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded text-white transition-colors focus:outline-none"
                                    style={{ backgroundColor: '#0F171E', border: '1px solid #425265' }}
                                    onFocus={(e) => e.target.style.borderColor = '#00A8E1'}
                                    onBlur={(e) => e.target.style.borderColor = '#425265'}
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2" htmlFor="password">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded text-white transition-colors focus:outline-none"
                                    style={{ backgroundColor: '#0F171E', border: '1px solid #425265' }}
                                    onFocus={(e) => e.target.style.borderColor = '#00A8E1'}
                                    onBlur={(e) => e.target.style.borderColor = '#425265'}
                                    placeholder="Contraseña"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: '#00A8E1' }} />
                                    <span className="text-sm" style={{ color: '#8197A4' }}>Recordarme</span>
                                </label>
                                <a href="#" className="text-sm hover:underline" style={{ color: '#00A8E1' }}>
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 text-white font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                style={{ backgroundColor: '#00A8E1' }}
                                onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#00C8FF')}
                                onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#00A8E1')}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Iniciando sesión...
                                    </>
                                ) : 'Iniciar sesión'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6" style={{ borderTop: '1px solid #425265' }}>
                            <p className="text-center text-sm" style={{ color: '#8197A4' }}>
                                ¿Nuevo en CineStream?{' '}
                                <Link to="/register" className="hover:underline font-medium" style={{ color: '#00A8E1' }}>
                                    Crear cuenta
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-8 text-center">
                        <div className="flex justify-center gap-6 text-xs" style={{ color: '#8197A4' }}>
                            <a href="#" className="hover:text-white transition-colors">Condiciones de uso</a>
                            <a href="#" className="hover:text-white transition-colors">Aviso de privacidad</a>
                            <a href="#" className="hover:text-white transition-colors">Ayuda</a>
                        </div>
                        <p className="mt-4 text-xs" style={{ color: '#8197A4' }}>
                            © 2024 CineStream
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;

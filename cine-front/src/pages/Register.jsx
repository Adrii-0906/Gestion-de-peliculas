import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setIsLoading(true);
        try {
            await axios.post('http://localhost:8081/api/usuarios', {
                username,
                email,
                password,
                rol: 'USUARIO',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + username
            });
            navigate('/login');
        } catch (err) {
            setError('Error al crear la cuenta. El email podría estar en uso.');
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
                    {/* Register Card */}
                    <div className="rounded-lg p-8 border" style={{ backgroundColor: '#1A242F', borderColor: '#425265' }}>
                        <h1 className="text-2xl font-semibold text-white mb-2">Crear cuenta</h1>
                        <p className="text-sm mb-6" style={{ color: '#8197A4' }}>
                            Únete a millones de usuarios que disfrutan de CineStream
                        </p>

                        {error && (
                            <div className="mb-6 p-4 rounded flex items-start gap-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)', border: '1px solid' }}>
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f87171' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm" style={{ color: '#fecaca' }}>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2" htmlFor="username">
                                    Tu nombre
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 rounded text-white transition-colors focus:outline-none"
                                    style={{ backgroundColor: '#0F171E', border: '1px solid #425265' }}
                                    onFocus={(e) => e.target.style.borderColor = '#00A8E1'}
                                    onBlur={(e) => e.target.style.borderColor = '#425265'}
                                    placeholder="Nombre de usuario"
                                    required
                                />
                            </div>

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
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2" htmlFor="confirmPassword">
                                    Confirmar contraseña
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded text-white transition-colors focus:outline-none"
                                    style={{ backgroundColor: '#0F171E', border: '1px solid #425265' }}
                                    onFocus={(e) => e.target.style.borderColor = '#00A8E1'}
                                    onBlur={(e) => e.target.style.borderColor = '#425265'}
                                    placeholder="Repite la contraseña"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 text-white font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                                style={{ backgroundColor: '#00A8E1' }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#00C8FF'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#00A8E1'}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creando cuenta...
                                    </>
                                ) : 'Crear cuenta'}
                            </button>
                        </form>

                        <p className="mt-6 text-xs text-center" style={{ color: '#8197A4' }}>
                            Al crear una cuenta, aceptas los{' '}
                            <a href="#" style={{ color: '#00A8E1' }} className="hover:underline">Términos de uso</a>
                            {' '}y la{' '}
                            <a href="#" style={{ color: '#00A8E1' }} className="hover:underline">Política de privacidad</a>
                        </p>

                        <div className="mt-8 pt-6" style={{ borderTop: '1px solid #425265' }}>
                            <p className="text-center text-sm" style={{ color: '#8197A4' }}>
                                ¿Ya tienes cuenta?{' '}
                                <Link to="/login" style={{ color: '#00A8E1' }} className="hover:underline font-medium">
                                    Iniciar sesión
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

export default Register;

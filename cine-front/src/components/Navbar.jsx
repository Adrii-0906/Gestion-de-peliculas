import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [instantResults, setInstantResults] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedProfile = localStorage.getItem('currentProfile');
    if (storedProfile) {
      setCurrentProfile(JSON.parse(storedProfile));
    } else {
      setCurrentProfile(null);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  // Instant Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        api.get(`/peliculas/search?query=${encodeURIComponent(searchQuery)}`)
          .then(res => setInstantResults(res.data.slice(0, 5))) // Top 5
          .catch(err => console.error(err));
      } else {
        setInstantResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('currentProfile');
    setUser(null);
    setCurrentProfile(null);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setInstantResults([]);
    }
  };

  if (location.pathname === '/login' || location.pathname === '/register') return null;

  const navLinks = [
    { name: 'Inicio', path: '/home', active: location.pathname === '/home' },
    { name: 'Mi Lista', path: '/mi-lista', active: location.pathname === '/mi-lista' },
    { name: 'Categorías', path: '/search', active: location.pathname === '/search' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? '#0F171E' : 'transparent',
        backgroundImage: scrolled ? 'none' : 'linear-gradient(to bottom, #0F171E, rgba(15, 23, 30, 0.8), transparent)'
      }}
    >
      <div className="flex items-center justify-between px-6 lg:px-10 h-16">

        {/* Left Section: Logo + Navigation */}
        <div className="flex items-center gap-8">
          <Link to="/home" className="flex items-center gap-1 group">
            <span className="text-2xl font-bold text-white tracking-tight">
              Cine<span style={{ color: '#00A8E1' }}>Stream</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-4 py-2 text-sm font-medium rounded transition-all duration-200"
                style={{
                  color: link.active ? '#FFFFFF' : '#8197A4',
                  backgroundColor: link.active ? '#1A242F' : 'transparent'
                }}
                onMouseOver={(e) => {
                  if (!link.active) {
                    e.target.style.color = '#FFFFFF';
                    e.target.style.backgroundColor = 'rgba(26, 36, 47, 0.5)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!link.active) {
                    e.target.style.color = '#8197A4';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {link.name}
              </Link>
            ))}

            {user?.rol === 'ADMINISTRADOR' && (
              <Link
                to="/admin"
                className="px-4 py-2 text-sm font-medium rounded transition-all duration-200"
                style={{ color: '#fb923c' }}
                onMouseOver={(e) => {
                  e.target.style.color = '#fdba74';
                  e.target.style.backgroundColor = 'rgba(26, 36, 47, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#fb923c';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Right Section: Search + User */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <div className="relative">
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar..."
                    autoFocus
                    className="w-48 lg:w-64 px-4 py-2 rounded text-white text-sm focus:outline-none transition-all duration-200"
                    style={{ backgroundColor: '#1A242F', border: '1px solid #425265' }}
                    onFocus={(e) => e.target.style.borderColor = '#00A8E1'}
                    onBlur={(e) => {
                      // Small delay to allow clicking results
                      setTimeout(() => {
                        if (!searchQuery) setSearchOpen(false);
                      }, 200);
                      e.target.style.borderColor = '#425265';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); setInstantResults([]); }}
                    className="ml-2 hover:text-white transition-colors"
                    style={{ color: '#8197A4' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </form>

                {/* Instant Results Dropdown */}
                {instantResults.length > 0 && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl overflow-hidden z-50"
                    style={{ backgroundColor: '#1A242F', border: '1px solid #425265' }}
                  >
                    {instantResults.map(p => (
                      <Link
                        key={p.id}
                        to={`/peliculas/${p.id}`}
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); setInstantResults([]); }}
                        className="flex items-center gap-3 p-3 hover:bg-[#2A3847] transition-colors"
                      >
                        <img
                          src={p.imagenUrl || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI1NiIgdmlld0JveD0iMCAwIDQwIDU2Ij4KICA8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNTYiIGZpbGw9IiMzMzMiIC8+Cjwvc3ZnPg=="}
                          alt={p.titulo}
                          className="w-10 h-14 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI1NiIgdmlld0JveD0iMCAwIDQwIDU2Ij4KICA8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNTYiIGZpbGw9IiMzMzMiIC8+Cjwvc3ZnPg==";
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">{p.titulo}</span>
                          <span className="text-xs text-[#8197A4]">{new Date(p.fechaEstreno).getFullYear()}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-white transition-colors"
                style={{ color: '#FFFFFF' }}
                onMouseOver={(e) => e.target.style.color = '#00A8E1'}
                onMouseOut={(e) => e.target.style.color = '#FFFFFF'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-1 rounded transition-colors" style={{ backgroundColor: 'transparent' }}>
              <img
                src={currentProfile?.avatar || user?.avatar || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"}
                alt="Avatar"
                className="w-8 h-8 rounded object-cover"
                onError={(e) => e.target.src = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"}
              />
              <span className="hidden lg:block text-sm text-white font-medium">
                {currentProfile?.name || user?.username || 'Invitado'}
              </span>
              <svg className="w-4 h-4" style={{ color: '#8197A4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
              style={{ backgroundColor: '#1A242F', border: '1px solid #425265' }}
            >
              <div className="p-3" style={{ borderBottom: '1px solid #425265' }}>
                <p className="text-white font-medium">{currentProfile?.name || user?.username || 'Invitado'}</p>
                <p className="text-xs truncate" style={{ color: '#8197A4' }}>{user?.email || ''}</p>
              </div>
              <div className="p-2">
                <Link
                  to="/"
                  className="block px-3 py-2 text-sm text-white rounded transition-colors"
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2A3847'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Mi cuenta
                </Link>
                <Link
                  to="/mi-lista"
                  className="block px-3 py-2 text-sm text-white rounded transition-colors"
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2A3847'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Mi lista
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm rounded transition-colors"
                  style={{ color: '#fb923c' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2A3847'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
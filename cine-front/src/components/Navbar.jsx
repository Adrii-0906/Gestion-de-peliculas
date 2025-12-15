import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('currentProfile');
    setUser(null);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  // Hide navbar on auth pages
  if (location.pathname === '/login' || location.pathname === '/register') return null;

  const navLinks = [
    { name: 'Inicio', path: '/home', active: location.pathname === '/home' },
    { name: 'Películas', path: '/home', active: false },
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
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-1 group">
            <span className="text-2xl font-bold text-white tracking-tight">
              Cine<span style={{ color: '#00A8E1' }}>Stream</span>
            </span>
          </Link>

          {/* Navigation Tabs */}
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

            {/* Admin Link */}
            <Link
              to="/manage-movies"
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
          </div>
        </div>

        {/* Right Section: Search + User */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="relative">
            {searchOpen ? (
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
                  onBlur={(e) => e.target.style.borderColor = '#425265'}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="ml-2 hover:text-white transition-colors"
                  style={{ color: '#8197A4' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
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
                src={user?.avatar || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"}
                alt="Avatar"
                className="w-8 h-8 rounded object-cover"
                onError={(e) => e.target.src = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"}
              />
              <span className="hidden lg:block text-sm text-white font-medium">
                {user?.username || 'Invitado'}
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
                <p className="text-white font-medium">{user?.username || 'Invitado'}</p>
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
                  to="/search"
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